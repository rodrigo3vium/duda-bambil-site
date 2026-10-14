/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // /v2 foi a prévia da Home nova enviada pra aprovação da Duda. Virou a
      // Home; o redirect só evita 404 em quem ainda tem o link.
      { source: "/v2", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
