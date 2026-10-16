/**
 * PostCSS: Tailwind + autoprefixer.
 * O plugin do Tailwind só injeta utilitários em arquivos com @tailwind (só o
 * app/comece/comece.css). Os CSS existentes (globals.css, *.module.css) passam
 * batido — só recebem autoprefixer.
 */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
