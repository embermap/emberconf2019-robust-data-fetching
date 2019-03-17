import Route from '@ember/routing/route';

export default Route.extend({

  model(params) {
    return this.store.findRecord('stock', params.stock_id, { reload: true });
  }

});
