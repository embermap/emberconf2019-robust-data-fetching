import Route from '@ember/routing/route';

export default Route.extend({

  init() {
    this._super(...arguments);
    this.hasLoadedReviews = {};
  },

  model(params) {
    let stockId = params.stock_id;
    let hasLoaded = this.hasLoadedReviews[stockId];

    return this.store.findRecord('stock', params.stock_id, {
      include: 'reviews',
      reload: !hasLoaded
    });
  },

  afterModel(stock) {
    this.hasLoadedReviews[stock.id] = true;
  }

});
