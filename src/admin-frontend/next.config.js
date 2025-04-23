/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // В production-среде мы бы использовали nginx для статических файлов,
  // но в разработке давайте позволим Next.js обслуживать статику
  // и проксировать API запросы через nginx
  async rewrites() {
    // В режиме разработки запросы API идут на nginx
    const apiBaseUrl = process.env.API_BASE_URL || 'http://nginx';
    
    return [
      // API запросы к auth сервису
      {
        source: '/api/auth/:path*',
        destination: `${apiBaseUrl}/api/auth/:path*`,
      },
      // API запросы к user сервису
      {
        source: '/api/users/:path*',
        destination: `${apiBaseUrl}/api/users/:path*`,
      },
      // API запросы к product сервису
      {
        source: '/api/products/:path*',
        destination: `${apiBaseUrl}/api/products/:path*`,
      },
      // API запросы к order сервису
      {
        source: '/api/orders/:path*',
        destination: `${apiBaseUrl}/api/orders/:path*`,
      },
    ];
  },
  // Настройка CORS для обработки запросов от других доменов
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // В продакшене следует указать конкретный домен
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 