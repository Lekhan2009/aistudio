/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'res.cloudinary.com', 'images.unsplash.com']
  },
  // You can uncomment this if you're intentionally using experimental features
  // Make sure they're supported and needed before using them in production
  /*
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
    esmExternals: 'loose'
  },
  */
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
      'supports-color': 'commonjs supports-color',
      'kerberos': 'commonjs kerberos',
      '@mongodb-js/zstd': 'commonjs @mongodb-js/zstd',
      '@aws-sdk/credential-providers': 'commonjs @aws-sdk/credential-providers',
      'gcp-metadata': 'commonjs gcp-metadata',
      'snappy': 'commonjs snappy',
      'aws4': 'commonjs aws4',
      'mongodb-client-encryption': 'commonjs mongodb-client-encryption'
    });
    return config;
  }
};

module.exports = nextConfig;
