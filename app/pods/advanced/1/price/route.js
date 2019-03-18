import Route from '@ember/routing/route';
// eslint-disable-next-line
import isSecondsOld from 'emberconf2019-robust-data-fetching/utils/is-seconds-old';

/*
  How to use isSecondsOld
  -----------------------

  This function takes a date and a number of seconds. If
  the date is more than that many seconds old it returns
  true.

  let date = new Date();

  // is the date 30 seconds old?

  isSecondsOld(date, 30) // => false

  // is the date 60 seconds old?

  isSecondsOld(date, 60) // => false

  // wait 30 seconds...

  isSecondsOld(30, date) // => true
  isSecondsOld(60, date) // => false

  // wait 1 minute...

  isSecondsOld(30, date) // => true
  isSecondsOld(60, date) // => true
*/

export default Route.extend({

  model(params) {
    // dont reload the stock if it's been loaded in the
    // last 30 seconds.
    return this.store.findRecord('stock', params.stock_id, {
      reload: true
    });
  }

});
