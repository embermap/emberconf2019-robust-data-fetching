import DS from 'ember-data';

export default DS.Model.extend({
  text: DS.attr('string'),
  article: DS.belongsTo('article')
});
