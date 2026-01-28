/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
         // Map existing CSS variables if needed, or rely on Tailwind's default palette which I used (slate, indigo, etc)
         border: "var(--border-color)",
         input: "var(--bg-tertiary)",
         ring: "var(--accent-primary)",
         background: "var(--bg-primary)",
         foreground: "var(--text-primary)",
      },
    },
  },
  plugins: [],
}
