import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  serverSpeed: service(),

  delay: alias('serverSpeed.delay'),

  isShowingServerSpeed: false,

  delaySeconds: computed('delay', function() {
    return this.delay / 1000.0;
  }),

  updateServerSpeed: task(function*(event) {
    this.set('delay', event.target.value);

    yield timeout(300);

    yield fetch('/delay', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ delay: event.target.value })
    });
  }).restartable(),

  actions: {
    toggle(event) {
      event.preventDefault();
      this.set('isShowingServerSpeed', !this.isShowingServerSpeed);
    }
  }
});
