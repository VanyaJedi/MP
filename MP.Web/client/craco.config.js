const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
    plugin: CracoLessPlugin,
    options: {
      lessLoaderOptions: {
      lessOptions: {
        modifyVars: { 
          '@primary-color': '#1a1820',
          '@body-background': '#0D0C14',
          '@text-color': '#ffffff',
          '@heading-color': '#ffffff',
          '@link-color': '#dbdbdc',
          '@link-hover-color': '#e7e7e8',
          '@link-active-color': '#f8f8f8',
          '@input-color': '#000000',
          '@typography-title-margin-bottom': 0,
          '@alert-text-color': '#000000',
          '@alert-message-color': '#000000'
        },
        javascriptEnabled: true,
      },
      },
    },
    },
  ],
  };