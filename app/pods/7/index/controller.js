import Controller from '@ember/controller';

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.set('articlesShowingComments', []);
  },

  actions: {
    toggleArticleComments(article) {
      if (this.articlesShowingComments.includes(article)) {
        this.articlesShowingComments.removeObject(article);
      } else {
        this.articlesShowingComments.addObject(article);
      }
    }
  }
});
