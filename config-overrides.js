const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')
module.exports = function override (config, env) {
  if (env === 'production') {
    const addOptions = {
      inlineSource: '.(js|css)$',
      inject: 'body'
    }
    Object.assign(
      config.plugins
        .find(plugin => Object.getPrototypeOf(plugin).constructor.name === 'HtmlWebpackPlugin')
        .userOptions,
      addOptions
    )
    config.plugins.push(new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [ /\.(css|js)$/]))
  }
  return config
}
