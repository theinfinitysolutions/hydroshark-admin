/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd2g3h1gpjmm5ra.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'd39g9o3xvlax7g.cloudfront.net',
      },
    ],
    unoptimized: true,
  },
  //   transpilePackages: ["three"],
  //   webpack: (config, { isServer }) => {
  //     config.module.rules.push({
  //       test: /\.obj$/,
  //       use: [
  //         {
  //           loader: "file-loader",
  //           options: {
  //             name: "[name].[ext]",
  //             outputPath: "static/models/",
  //             publicPath: "/_next/static/models/",
  //           },
  //         },
  //       ],
  //     });

  //     return config;
  //   },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*/',
        destination: process.env.NEXT_PUBLIC_API + '/api/:path*/',
      },
    ];
  },
};

export default nextConfig;
