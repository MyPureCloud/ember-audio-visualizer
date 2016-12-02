/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-audio-visualizer',
  isDevelopingAddon: function () {
    // return this.app && this.app.env === 'development';
    return Boolean(process.env.EAV_DEV_MODE);
  },
  included: function (app) {
    this._super.included(app);

    this.app = app;

    // Fix when https://github.com/webrtc/adapter/issues/206
    app.import(app.bowerDirectory + '/webrtc-adapter/adapter-1.4.0.js');
  }
};
