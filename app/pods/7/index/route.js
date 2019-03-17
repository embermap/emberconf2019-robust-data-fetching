import Route from '@ember/routing/route';

export default Route.extend({
  stocks: null,

  model() {
    if (!this.stocks) {
      return this.store.query('stock', {});
    } else {
      return this.stocks;
    }
  },

  afterModel(model) {
    if (!this.stocks) {
      this.set('stocks', model);
    }
  }

});
