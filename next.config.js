/** @type {import('next').NextConfig} */
const nextConfig = {}


plugins: [
    new webpack.ProvidePlugin({
      window: 'window',
    }),
  ],
  
module.exports = nextConfig
