import Ember from 'ember';
import {test, moduleFor} from 'ember-qunit';
import sinon from 'sinon';

const {
  run
} = Ember;

let component;

moduleFor('component:audio-visualizer', 'Unit | Component | audio-visualizer', {
  needs: []
});

test('resetVisualization | should not run until there is an audioStream', function (assert) {
  run(() => {
    component = this.subject({
      _cleanupAnalyzer: sinon.spy(),
      _visualizeAudio: sinon.spy()
    });
  });

  run(() => {
    assert.notOk(component.get('hasStarted'));
    sinon.assert.notCalled(component._cleanupAnalyzer);
  });

  run(() => {
    component.set('audioStream', {});
    sinon.assert.called(component._cleanupAnalyzer);
    sinon.assert.called(component._visualizeAudio);
    assert.ok(component.get('hasStarted'));
  });
});

test('_cleanupAnalyzer | should clear audioCtx and animation frame', function (assert) {
  component = this.subject({
    _visualizeAudio: sinon.spy()
  });

  assert.notOk(component.audioCtx);
  assert.notOk(component.currentAnimationFrame);

  const closeSpy = sinon.spy();
  component.set('audioCtx', {close: closeSpy});
  component.set('currentAnimationFrame', 12);

  sinon.stub(window, 'cancelAnimationFrame');
  component._cleanupAnalyzer();

  sinon.assert.called(closeSpy);
  sinon.assert.called(window.cancelAnimationFrame);
  assert.notOk(component.audioCtx);
  assert.notOk(component.currentAnimationFrame);
});

test('willDestroyElement | should cleanup', function (assert) {
  assert.expect(0);

  const spy = sinon.spy();

  component = this.subject({
    _cleanupAnalyzer: spy
  });

  run(() => {
    component.willDestroyElement();
  });

  sinon.assert.called(spy);
});
