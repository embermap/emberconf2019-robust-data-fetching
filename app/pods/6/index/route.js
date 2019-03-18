import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.loadRecords('stock', {
      include: 'articles'
    });
  }
});
