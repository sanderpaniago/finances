module.exports = {
  reactStrictMode: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.gql$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader'
    })

    return config
  }
}
