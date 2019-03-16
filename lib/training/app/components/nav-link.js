import Component from '@ember/component';
import { oneWay } from '@ember/object/computed';

export default Component.extend({

  tagName: ''

}).reopenClass({

  positionalParams: [ 'route' ],
  step: oneWay('route')

});
