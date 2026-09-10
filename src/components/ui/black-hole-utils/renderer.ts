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

  let resolveReady: () => void;
  const ready = new Promise<void>((resolve) => {
    resolveReady = resolve;
  });

  const gl =
    canvas.getContext("webgl", { alpha: true, antialias: true, preserveDrawingBuffer: false }) ||
    (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

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
        const cx = w > 1024 ? w * 0.65 : w * 0.5;
        const cy = h * 0.5;
        const radius = Math.min(w, h) * 0.15;

        // Accretion disk
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1.0, 0.35);

        const grad = ctx.createRadialGradient(0, 0, radius * 0.7, 0, 0, radius * 2.8);
        grad.addColorStop(0, "rgba(255, 245, 220, 0.95)");
        grad.addColorStop(0.25, "rgba(255, 170, 50, 0.85)");
        grad.addColorStop(0.65, "rgba(200, 50, 15, 0.45)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Top arch
        ctx.save();
        ctx.translate(cx, cy - radius * 0.2);
        ctx.scale(1.0, 0.6);
        ctx.strokeStyle = "rgba(255, 200, 100, 0.8)";
        ctx.lineWidth = 12;
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
        ctx.lineWidth = 2.5;
        ctx.stroke();

        animationFrameId = requestAnimationFrame(render2D);
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

  // WebGL Raymarching Interstellar Black Hole Shader
  const vsSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fsSource = `
    precision highp float;

    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;

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

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = rot * p * 2.0;
        a *= 0.5;
      }
      return v;
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
      
      // Position black hole on the right on desktop, centered on mobile
      vec2 center = vec2(aspect > 1.2 ? 0.66 : 0.5, 0.5);
      vec2 st = (gl_FragCoord.xy - center * u_resolution.xy) / u_resolution.y;
      
      // Interactive mouse tilt
      float yaw = (u_mouse.x - 0.5) * 0.8;
      float pitch = (u_mouse.y - 0.5) * 0.35 + 0.14; 
      
      float cy = cos(yaw), sy = sin(yaw);
      float cp = cos(pitch), sp = sin(pitch);
      
      // Camera position
      vec3 ro = vec3(sy * cp, sp, cy * cp) * 3.8;
      vec3 ta = vec3(0.0, 0.0, 0.0);
      
      vec3 ww = normalize(ta - ro);
      vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
      vec3 vv = cross(uu, ww);
      
      vec3 rd = normalize(st.x * uu + st.y * vv + 1.4 * ww);
      
      // Physical dimensions
      const float rs = 0.25;        // Schwarzschild radius
      const float r_in = 0.42;      // Inner accretion disk edge
      const float r_out = 1.65;     // Outer accretion disk edge
      
      vec3 pos = ro;
      vec3 dir = rd;
      
      vec3 accumColor = vec3(0.0);
      float accumAlpha = 0.0;
      
      bool hitHorizon = false;
      float dt = 0.025;
      float lastY = pos.y;
      
      // Geodesic raymarching loop preserving angular momentum
      for (int i = 0; i < 140; i++) {
        float r = length(pos);
        
        if (r < rs) {
          hitHorizon = true;
          break;
        }
        
        if (r > 6.5 && dot(pos, dir) > 0.0) {
          break;
        }
        
        // Exact Schwarzschild angular momentum deflection: a = -1.5 * rs * L^2 * pos / r^5
        vec3 L = cross(pos, dir);
        float L2 = dot(L, L);
        vec3 accel = -1.5 * rs * L2 * pos / pow(r, 5.0);
        
        dir = normalize(dir + accel * dt);
        vec3 nextPos = pos + dir * dt;
        
        // Check accretion disk intersection (plane y = 0)
        if ((lastY > 0.0 && nextPos.y <= 0.0) || (lastY < 0.0 && nextPos.y >= 0.0)) {
          float t_hit = -lastY / (nextPos.y - lastY + 1e-6);
          vec3 diskHit = mix(pos, nextPos, clamp(t_hit, 0.0, 1.0));
          float diskR = length(diskHit.xz);
          
          if (diskR >= r_in && diskR <= r_out) {
            float angle = atan(diskHit.z, diskHit.x);
            
            float speed = 1.0 / sqrt(diskR);
            float animAngle = angle + u_time * speed * 0.35;
            
            // Accretion disk swirling turbulence
            float n1 = fbm(vec2(diskR * 6.5, animAngle * 3.5));
            float n2 = fbm(vec2(diskR * 14.0 - u_time * 0.35, animAngle * 7.0));
            
            float density = smoothstep(r_in, r_in + 0.18, diskR) * smoothstep(r_out, r_out - 0.4, diskR);
            density *= (0.45 + 0.55 * n1) * (0.8 + 0.2 * n2);
            
            float temp = pow(clamp((r_out - diskR) / (r_out - r_in), 0.0, 1.0), 1.5);
            temp *= (0.85 + 0.35 * n1);
            
            // Relativistic Doppler beaming
            vec3 diskVel = vec3(-sin(angle), 0.0, cos(angle)) * speed;
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
        
        // Adaptive step size: high precision near photon sphere
        dt = clamp((r - rs * 0.92) * 0.045, 0.008, 0.045);
      }
      
      // Distorted background starfield
      if (!hitHorizon) {
        vec3 bgDir = normalize(dir);
        float starVal = hash3(floor(bgDir * 170.0));
        if (starVal > 0.985) {
          float starGlow = pow((starVal - 0.985) / 0.015, 2.0);
          float twinkle = 0.75 + 0.25 * sin(u_time * 3.5 + starVal * 120.0);
          accumColor += vec3(0.9, 0.95, 1.0) * starGlow * twinkle * (1.0 - accumAlpha);
        }
        
        // Thin photon ring right at the edge of the shadow
        float minR = length(cross(ro, rd));
        float photonHalo = exp(-abs(minR - rs * 1.2) * 32.0) * 0.6;
        accumColor += vec3(1.0, 0.92, 0.78) * photonHalo * (1.0 - accumAlpha);
      }
      
      // Tone mapping
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

  let mouseX = 0.5;
  let mouseY = 0.5;
  let targetMouseX = 0.5;
  let targetMouseY = 0.5;

  const handleMouseMove = (e: MouseEvent) => {
    if (window.innerWidth > 0 && window.innerHeight > 0) {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = e.clientY / window.innerHeight;
    }
  };

  window.addEventListener("mousemove", handleMouseMove, { passive: true });

  const resizeCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = Math.floor((canvas.clientWidth || window.innerWidth) * dpr);
    const displayHeight = Math.floor((canvas.clientHeight || window.innerHeight) * dpr);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  };

  const startTime = performance.now();

  const render = (currentTime: number) => {
    if (isDisposed) return;

    resizeCanvas();

    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    const elapsedTime = (currentTime - startTime) * 0.001;

    gl.useProgram(program);
    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
    gl.uniform1f(timeUniformLocation, elapsedTime);
    gl.uniform2f(mouseUniformLocation, mouseX, mouseY);

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
      if (program && gl) {
        gl.deleteProgram(program);
      }
    },
  };
}
