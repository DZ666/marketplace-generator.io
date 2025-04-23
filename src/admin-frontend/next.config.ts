import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },
  // Добавляем настройку rewrites для проксирования запросов к auth сервису
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: `${process.env.AUTH_SERVICE_URL || 'http://localhost:4000'}/auth/:path*` // Используем переменную окружения или значение по умолчанию
      }
    ];
  }
};

export default nextConfig;
