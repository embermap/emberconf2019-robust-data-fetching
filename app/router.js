import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('1', { path: '/' });

  this.route('2', function() {
    this.route('stock-detail', { path: '/:stock_id' });
  });

  this.route('3', function() {
    this.route('stock-detail', { path: '/:stock_id' });
  });

  this.route('4', function() {
    this.route('stock-detail', { path: '/:stock_id' });
  });

  this.route('5', function() {
    this.route('price', { path: '/:stock_id/price' });
    this.route('reviews', { path: '/:stock_id/reviews' });
  });

  this.route('6', function() {});

  this.route('7', function() {});

  this.route('8', function() {});

  this.route('9');

  this.route('advanced', function() {
    this.route('1', function() {
      this.route('price', { path: '/:stock_id/price' });
      this.route('reviews', { path: '/:stock_id/reviews' });
    });
  });
});

export default Router;
