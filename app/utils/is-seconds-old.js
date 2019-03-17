import moment from 'moment';

export default function(date, seconds) {
  return moment(date).add(seconds, 'seconds').isBefore(new Date());
}
