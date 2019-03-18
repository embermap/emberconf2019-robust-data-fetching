import Component from '@ember/component';

export default Component.extend({
  // this is the model we want to load data for, in our case
  // it would be an article.
  model: null,

  // this is the string version of the the relationship we want to load,
  // for this exercise, it's 'comments'
  relationship: null,

  // this should expose the state of the data provider, if we're loading data
  // set it to true
  isLoading: false,

  // this should be the data the provider will yield to our caller. In this
  // exercise it's the article's comments.
  data: null

}).reopenClass({
  positionalParams: ['model', 'relationship']
});
