# Krishna Singh — Portfolio Website

My personal portfolio website.

Built to showcase the projects I’ve shipped — hardware, security tools, AI agents, and full-stack systems.

If you're forking this or using it as a base, here’s everything you need to customize it fast.

---

## Design & Customization (The Important Stuff)

This is not a generic portfolio theme.
It’s heavy on:
micro-interactions
motion feedback
custom animations
deliberate layout control

Most content is hardcoded on purpose so the design stays precise.


### How to Make It Yours

most of the text and links are hardcoded in the components because I wanted full control over the layout. Here is where you need to look to change things:

#### 1. The Hero Section (`src/sections/Hero.tsx`)
This is the first thing people see.
- **Name & specific text**: Search for "KRISHNA SINGH" or "OUTWORK" in this file and swap it with your name and mantra.
- **The Vinyl Player**: It plays background audio.
    - The audio file is located at `public/assets/music.mp3`.
    - **Pro Tip**: Replace `music.mp3` with your own lofi track or ambient noise. Just keep the filename the same or update the path in `Hero.tsx` line 11.

#### 2. Contact Links (`src/sections/Contact.tsx`)
Don't be that person who leaves my email in their portfolio.
- Go to `src/sections/Contact.tsx`.
- Look for the `socialLinks` array near the top of the component.
- Update the `href` and `username` fields for Mail, LinkedIn, and GitHub.

#### 3. Images & Assets (`public/assets/`)
I've included some placeholder images that I used for the project.
- **`music.mp3`**: The background track.
- **Project Images**: If you see files like `autonomous_agents.png` or `blackesp_device.png`, these are used in the project grid or work section. You should delete my images and drop yours in here.
- **Icons**: I'm using `lucide-react` for most icons, so you can easily swap those out in the code if you want differnt symbols.

#### 4. The Cursor (`src/components/CustomCursor.tsx`)
Yes, the cursor is custom. It's meant to feel like a system pointer. If you hate it (why?), you can comment out `<CustomCursor />` in `App.tsx`.

---

## ⚡ Running the Project

Okay, here is the technical bit. It's a standard **Vite + React** setup. Fast, reliable, no magic.

### Stack
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (because writing vanilla CSS is pain)
- **Animations**: Framer Motion & GSAP (for the heavy lifting)

### Quick Start

1.  **Clone it**:
    ```bash
    git clone https://github.com/krishnakrsingh/3D-portfolioV2
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run it locally**:
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` (or whatever port Vite gives you) and start building.

### Building for Production(Deployment)
When you are ready to show the world:
```bash
npm run build
```
This generates a `dist` folder. You can drag and drop that folder into Netlify/Vercel, or set up a git integration to deploy automatically.

---

### One Last Thing
This code is written to be edited. Break things, change the colors in `tailwind.config.js`, mess with the animation speeds. Make it weird. Make it yours.

*peace out.*
