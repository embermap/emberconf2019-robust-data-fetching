import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  serverSpeed: service(),

  beforeModel() {
    return this.serverSpeed.load();
  }
});
