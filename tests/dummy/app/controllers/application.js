/* global navigator */

import Ember from 'ember';

export default Ember.Controller.extend({
  audioStream: null,

  init () {
    this._super(...arguments);

    navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(stream => {
      this.set('audioStream', stream);
    });
  }

});
