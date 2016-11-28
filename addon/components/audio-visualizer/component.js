import Ember from 'ember';
import layout from './template';

const {
  Component,
  observer
} = Ember;

export default Component.extend({
  classNames: ['audio-visualizer'],
  layout: layout,

  audioStream: null,
  backgroundColor: '#F5FCFF',
  lineColor: '#4F7787',

  canvasEl: null,
  canvasCtx: null,
  currentAnimationFrame: null,
  hasStarted: false,

  didInsertElement() {
    this._super(...arguments);
    const canvas = this.$('canvas')[0];
    this.set('canvasEl', canvas);
    this.set('canvasCtx', canvas.getContext('2d'));

    if (this.get('audioStream') && !this.get('hasStarted')) {
      this.resetVisualization();
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    this._cleanupAnalyzer();
  },

  _cleanupAnalyzer() {
    const audioCtx = this.get('audioCtx');
    if (audioCtx) {
      audioCtx.close();
      this.set('audioCtx', null);
    }

    if (this.get('currentAnimationFrame')) {
      cancelAnimationFrame(this.get('currentAnimationFrame'));
      this.set('currentAnimationFrame', null);
    }
  },

  resetVisualization: observer('audioStream', function () {
    this.set('hasStarted', true);
    this._cleanupAnalyzer();

    if (this.get('audioStream')) {
      this._visualizeAudio(this.get('audioStream'));
    }
  }),

  _visualizeAudio(stream) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioCtx();
    this.set('audioCtx', audioCtx);
    const analyser = audioCtx.createAnalyser();
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.65;

    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    const canvas = this.get('canvasEl');
    const width = canvas.width;
    const height = canvas.height;

    const canvasCtx = this.get('canvasCtx');

    const bufferLength = analyser.fftSize = 2048;
    console.log({bufferLength});
    const dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, width, height);
    const _this = this;

    function draw() {

      _this.set('currentAnimationFrame', requestAnimationFrame(draw));

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = _this.get('backgroundColor');
      canvasCtx.fillRect(0, 0, width, height);

      canvasCtx.lineWidth = 1;
      canvasCtx.strokeStyle = _this.get('lineColor');

      canvasCtx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {

        const v = dataArray[i] / 128.0;
        const y = v * height / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    }

    draw();
  }
});
