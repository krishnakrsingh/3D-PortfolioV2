export interface RendererOptions {
  canvas: HTMLCanvasElement;
}

export interface Renderer {
  ready: Promise<void>;
  dispose: () => void;
}

export function createRenderer(options: RendererOptions): Renderer {
  const { canvas } = options;
  let animationFrameId: number | null = null;
  let isDisposed = false;
  let isVisible = true;

  let resolveReady: () => void;
  const ready = new Promise<void>((resolve) => {
    resolveReady = resolve;
  });

  // Request high-performance GPU context with optimal composite flags
  const gl =
    canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
      desynchronized: true,
    }) ||
    (canvas.getContext("experimental-webgl", {
      powerPreference: "high-performance",
    }) as WebGLRenderingContext | null);

  if (!gl) {
    // 2D Fallback
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const render2D = () => {
        if (isDisposed) return;
        const w = canvas.width;
        const h = canvas.height;
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);
        const cx = w > 1200 ? w * 0.72 : (w > 800 ? w * 0.68 : w * 0.5);
        const cy = h * 0.5;
        const radius = Math.min(w, h) * 0.10;

        // Accretion disk
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1.0, 0.35);

        const grad = ctx.createRadialGradient(0, 0, radius * 0.7, 0, 0, radius * 3.2);
        grad.addColorStop(0, "rgba(255, 245, 220, 0.95)");
        grad.addColorStop(0.25, "rgba(255, 170, 50, 0.85)");
        grad.addColorStop(0.65, "rgba(200, 50, 15, 0.45)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Top arch
        ctx.save();
        ctx.translate(cx, cy - radius * 0.15);
        ctx.scale(1.0, 0.65);
        ctx.strokeStyle = "rgba(255, 200, 100, 0.85)";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 1.25, Math.PI, 0, false);
        ctx.stroke();
        ctx.restore();

        // Event Horizon
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Photon Ring
        ctx.strokeStyle = "rgba(255, 230, 180, 0.9)";
        ctx.lineWidth = 2.0;
        ctx.stroke();

        if (isVisible) {
          animationFrameId = requestAnimationFrame(render2D);
        }
      };
      render2D();
    }
    resolveReady!();
    return {
      ready,
      dispose: () => {
        isDisposed = true;
        if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      },
    };
  }

  // High-Performance WebGL Raymarching Shader
  const vsSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fsSource = `
    precision mediump float;

    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_pulse;
    uniform float u_energy;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float hash3(vec3 p) {
      p = fract(p * vec3(443.897, 441.423, 437.195));
      p += dot(p, p.yzx + 19.19);
      return fract((p.x + p.y) * p.z);
    }

    float noisePeriodicY(vec2 p, float periodY) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float y0 = mod(i.y, periodY);
      float y1 = y0 + 1.0 >= periodY ? 0.0 : y0 + 1.0;
      
      float a = hash(vec2(i.x, y0));
      float b = hash(vec2(i.x + 1.0, y0));
      float c = hash(vec2(i.x, y1));
      float d = hash(vec2(i.x + 1.0, y1));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbmDisk(vec2 p) {
      return 0.6 * noisePeriodicY(p, 22.0) + 0.4 * noisePeriodicY(p * 2.5, 55.0);
    }

    vec3 diskColorMap(float temperature, float density) {
      vec3 colWhite  = vec3(1.0, 0.98, 0.92);
      vec3 colGold   = vec3(1.0, 0.80, 0.35);
      vec3 colOrange = vec3(0.95, 0.42, 0.08);
      vec3 colRed    = vec3(0.55, 0.10, 0.02);
      
      vec3 c = mix(colRed, colOrange, smoothstep(0.0, 0.35, temperature));
      c = mix(c, colGold, smoothstep(0.35, 0.68, temperature));
      c = mix(c, colWhite, smoothstep(0.68, 1.0, temperature));
      
      return c * density;
    }

    void main() {
      float aspect = u_resolution.x / u_resolution.y;
      
      // Position black hole on right for desktop, centered for mobile
      float targetX = aspect > 1.3 ? 0.72 : (aspect > 1.05 ? 0.68 : 0.5);
      vec2 center = vec2(targetX, 0.5);
      vec2 st = (gl_FragCoord.xy - center * u_resolution.xy) / u_resolution.y;
      
      float yaw = u_mouse.x;
      float pitch = u_mouse.y; 
      
      float cy = cos(yaw), sy = sin(yaw);
      float cp = cos(pitch), sp = sin(pitch);
      
      vec3 ro = vec3(sy * cp, sp, cy * cp) * 4.9;
      vec3 ta = vec3(0.0, 0.0, 0.0);
      
      vec3 ww = normalize(ta - ro);
      vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
      vec3 vv = cross(uu, ww);
      
      vec3 rd = normalize(st.x * uu + st.y * vv + 1.45 * ww);
      
      // Compact middle radius with full halo arches
      const float rs = 0.20;        // Balanced Event Horizon radius
      const float r_in = 0.34;      // Inner accretion disk edge
      const float r_out = 1.55;     // Outer accretion disk edge
      
      vec3 pos = ro;
      vec3 dir = rd;
      
      vec3 accumColor = vec3(0.0);
      float accumAlpha = 0.0;
      
      bool hitHorizon = false;
      float minRadius = 100.0;
      float dt = 0.04;
      float lastY = pos.y;
      
      // 140 steps to fully trace rays bending around the horizon and through the disk
      for (int i = 0; i < 140; i++) {
        float r = length(pos);
        minRadius = min(minRadius, r);
        
        if (r < rs) {
          hitHorizon = true;
          break;
        }
        
        if (r > 6.5 && dot(pos, dir) > 0.0) {
          break;
        }
        
        // Exact Schwarzschild angular momentum deflection
        vec3 L = cross(pos, dir);
        float L2 = dot(L, L);
        vec3 accel = -1.5 * rs * L2 * pos / pow(r, 5.0);
        
        dir = normalize(dir + accel * dt);
        vec3 nextPos = pos + dir * dt;
        
        // Check disk intersection plane y = 0
        if ((lastY > 0.0 && nextPos.y <= 0.0) || (lastY < 0.0 && nextPos.y >= 0.0)) {
          float t_hit = -lastY / (nextPos.y - lastY + 1e-6);
          vec3 diskHit = mix(pos, nextPos, clamp(t_hit, 0.0, 1.0));
          float diskR = length(diskHit.xz);
          
          if (diskR >= r_in && diskR <= r_out) {
            float angle = atan(diskHit.z, diskHit.x);
            float speed = 1.0 / sqrt(diskR);
            float animAngle = angle + u_time * speed * (0.35 + u_energy * 0.15);
            
            // Seamless periodic angular coordinates (period = 22.0)
            float normTurns = fract(animAngle * 0.15915494309 + 1000.0);
            float n1 = fbmDisk(vec2(diskR * 6.5, normTurns * 22.0));
            
            float density = smoothstep(r_in, r_in + 0.16, diskR) * smoothstep(r_out, r_out - 0.35, diskR);
            density *= (0.45 + 0.55 * n1);
            
            float temp = pow(clamp((r_out - diskR) / (r_out - r_in), 0.0, 1.0), 1.5);
            temp *= (0.85 + 0.35 * n1);
            
            // Interactive relativistic shockwave ripple from clicks/taps
            if (u_pulse > 0.005) {
              float waveDist = (1.0 - u_pulse) * (r_out - r_in) + r_in;
              float wave = exp(-pow((diskR - waveDist) * 9.0, 2.0)) * u_pulse;
              density += wave * 0.55;
              temp += wave * 0.45;
            }
            
            // Interaction energy boost
            density *= (1.0 + u_energy * 0.25);
            temp *= (1.0 + u_energy * 0.20);
            
            vec2 dirXZ = diskHit.xz / diskR;
            vec3 diskVel = vec3(-dirXZ.y, 0.0, dirXZ.x) * speed;
            float doppler = 1.0 + 0.65 * dot(dir, diskVel);
            doppler = clamp(doppler, 0.35, 2.2);
            
            vec3 c = diskColorMap(temp, density * 1.6) * doppler;
            float alpha = clamp(density * 0.92 * doppler, 0.0, 1.0);
            
            accumColor += c * alpha * (1.0 - accumAlpha);
            accumAlpha += alpha * (1.0 - accumAlpha);
            
            if (accumAlpha > 0.98) break;
          }
        }
        
        lastY = nextPos.y;
        pos = nextPos;
        
        // Adaptive step size: fast in flat space, high precision near singularity
        dt = (r > 2.2) ? 0.14 : clamp((r - rs * 0.95) * 0.05, 0.008, 0.045);
      }
      
      if (!hitHorizon && (minRadius < rs * 1.15 || (dot(pos, dir) <= 0.0 && minRadius < r_in * 0.95))) {
        hitHorizon = true;
      }
      
      if (!hitHorizon) {
        vec3 bgDir = normalize(dir);
        float starVal = hash3(floor(bgDir * 160.0));
        if (starVal > 0.986) {
          float starGlow = pow((starVal - 0.986) / 0.014, 2.0);
          float twinkle = 0.75 + 0.25 * sin(u_time * 3.5 + starVal * 120.0);
          accumColor += vec3(0.9, 0.95, 1.0) * starGlow * twinkle * (1.0 - accumAlpha);
        }
        
        float photonHalo = exp(-abs(minRadius - rs * 1.25) * 35.0) * (0.65 + u_energy * 0.35 + u_pulse * 0.6);
        accumColor += vec3(1.0, 0.92, 0.78) * photonHalo * (1.0 - accumAlpha);
      }
      
      accumColor = vec3(1.0) - exp(-accumColor * 1.25);
      gl_FragColor = vec4(accumColor, 1.0);
    }
  `;

  const createShader = (type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);

  if (!vertexShader || !fragmentShader) {
    resolveReady!();
    return { ready, dispose: () => {} };
  }

  const program = gl.createProgram();
  if (!program) {
    resolveReady!();
    return { ready, dispose: () => {} };
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    resolveReady!();
    return { ready, dispose: () => {} };
  }

  gl.useProgram(program);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  const timeUniformLocation = gl.getUniformLocation(program, "u_time");
  const mouseUniformLocation = gl.getUniformLocation(program, "u_mouse");
  const pulseUniformLocation = gl.getUniformLocation(program, "u_pulse");
  const energyUniformLocation = gl.getUniformLocation(program, "u_energy");

  // Interaction and orbit state
  let mouseX = 0.5;
  let mouseY = 0.5;
  let targetMouseX = 0.5;
  let targetMouseY = 0.5;

  let cursorYaw = 0;
  let cursorPitch = 0;
  let orbitYaw = 0;
  let orbitPitch = 0;

  let velX = 0;
  let velY = 0;
  let isDragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;

  let pulse = 0;
  let energy = 0;
  let lastMoveTime = performance.now();
  let prevClientX = 0;
  let prevClientY = 0;

  const triggerPulse = () => {
    pulse = 1.0;
    energy = Math.min(1.0, energy + 0.6);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (window.innerWidth > 0 && window.innerHeight > 0) {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = e.clientY / window.innerHeight;

      const now = performance.now();
      const dt = Math.max(1, now - lastMoveTime);
      const dist = Math.hypot(e.clientX - prevClientX, e.clientY - prevClientY);
      const speed = dist / dt;
      if (speed > 0.08) {
        energy = Math.min(1.0, energy + speed * 0.08);
      }
      prevClientX = e.clientX;
      prevClientY = e.clientY;
      lastMoveTime = now;
    }
  };

  const handlePointerDown = (e: PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    isDragging = true;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    velX = 0;
    velY = 0;
    canvas.style.cursor = "grabbing";
    triggerPulse();
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPointerX;
    const dy = e.clientY - lastPointerY;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;

    const rotScale = 0.005;
    orbitYaw += dx * rotScale;
    orbitPitch = Math.max(-0.45, Math.min(0.65, orbitPitch - dy * rotScale));

    velX = dx * rotScale;
    velY = -dy * rotScale;

    energy = Math.min(1.0, energy + 0.15);
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (isDragging) {
      isDragging = false;
      canvas.style.cursor = "grab";
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }
  };

  canvas.style.cursor = "grab";
  window.addEventListener("mousemove", handleMouseMove, { passive: true });
  canvas.addEventListener("pointerdown", handlePointerDown);
  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", handlePointerUp);
  window.addEventListener("pointercancel", handlePointerUp);

  const resizeCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const displayWidth = Math.floor((canvas.clientWidth || window.innerWidth) * dpr);
    const displayHeight = Math.floor((canvas.clientHeight || window.innerHeight) * dpr);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  };

  let observer: IntersectionObserver | null = null;
  if (typeof IntersectionObserver !== "undefined") {
    observer = new IntersectionObserver(
      (entries) => {
        const isEntryVisible = entries[0]?.isIntersecting ?? true;
        if (isEntryVisible !== isVisible) {
          isVisible = isEntryVisible;
          if (isVisible && animationFrameId === null && !isDisposed) {
            animationFrameId = requestAnimationFrame(render);
          }
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);
  }

  const startTime = performance.now();

  const render = (currentTime: number) => {
    if (!isVisible) {
      animationFrameId = null;
      return;
    }

    if (isDisposed) return;

    resizeCanvas();

    // Smooth cursor tracking with higher responsiveness
    mouseX += (targetMouseX - mouseX) * 0.09;
    mouseY += (targetMouseY - mouseY) * 0.09;

    // High sensitivity cursor parallax tilt
    const targetCursorYaw = (mouseX - 0.5) * 1.5;
    const targetCursorPitch = (0.5 - mouseY) * 0.75;
    cursorYaw += (targetCursorYaw - cursorYaw) * 0.09;
    cursorPitch += (targetCursorPitch - cursorPitch) * 0.09;

    // Orbit physics
    if (!isDragging) {
      orbitYaw += velX;
      orbitPitch = Math.max(-0.45, Math.min(0.65, orbitPitch + velY));
      velX *= 0.93;
      velY *= 0.93;

      // Subtle majestic cosmic drift when idle
      orbitYaw += 0.0007;
    }

    // Decay interactive effects smoothly
    pulse = Math.max(0, pulse - 0.016);
    energy = Math.max(0, energy * 0.96);

    const totalYaw = orbitYaw + cursorYaw;
    const totalPitch = Math.max(-0.55, Math.min(0.75, orbitPitch + cursorPitch + 0.14));

    const elapsedTime = (currentTime - startTime) * 0.001;

    gl.useProgram(program);
    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
    gl.uniform1f(timeUniformLocation, elapsedTime);
    gl.uniform2f(mouseUniformLocation, totalYaw, totalPitch);
    if (pulseUniformLocation) gl.uniform1f(pulseUniformLocation, pulse);
    if (energyUniformLocation) gl.uniform1f(energyUniformLocation, energy);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    animationFrameId = requestAnimationFrame(render);
  };

  resizeCanvas();
  animationFrameId = requestAnimationFrame(render);
  resolveReady!();

  return {
    ready,
    dispose: () => {
      isDisposed = true;
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      if (observer) {
        observer.disconnect();
      }
      if (program && gl) {
        gl.deleteProgram(program);
      }
    },
  };
}
