import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',        // 告訴 GitHub 這是靜態網站
  images: {
    unoptimized: true,     // 解決 GitHub 不支援圖片優化的問題
  },
  // 因為你的專案名為 3d-portfolio，GitHub Pages 會把它放在 /3d-portfolio/ 底下
  basePath: '/3d-portfolio',
};

export default nextConfig;
