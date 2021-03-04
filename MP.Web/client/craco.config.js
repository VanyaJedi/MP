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
          '@body-background': '#000000',
          '@text-color': '#ffffff',
          '@heading-color': '#ffffff',
          '@link-color': '#dbdbdc',
          '@link-hover-color': '#e7e7e8',
          '@link-active-color': '#f8f8f8',
          '@input-color': '#000000',
          '@typography-title-margin-bottom': 0,
          '@alert-text-color': '#000000',
          '@alert-message-color': '#000000',
          '@modal-header-padding-vertical': 0,
          '@modal-header-padding-horizontal': 0,
          '@modal-body-padding': 0,
          '@alert-error-bg-color': '#000000'
        },
        javascriptEnabled: true,
      },
      },
    },
    },
  ],
  };