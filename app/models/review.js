import DS from 'ember-data';

export default DS.Model.extend({
  rating: DS.attr('number'),
  stock: DS.belongsTo('stock')
});
