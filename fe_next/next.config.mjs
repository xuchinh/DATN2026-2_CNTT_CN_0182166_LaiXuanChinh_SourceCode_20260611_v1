/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Cho phép next/image tải ảnh từ các host ngoài (ảnh demo/seed).
    // Ảnh thật của hệ thống nằm ở /uploads (local) nên không cần khai báo.
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
};

export default nextConfig;
