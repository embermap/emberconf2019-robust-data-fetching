import DS from 'ember-data';

export default DS.Model.extend({
  symbol: DS.attr('string'),
  price: DS.attr('number'),
  reviews: DS.hasMany('review'),
  articles: DS.hasMany('article', { async: false })
});
