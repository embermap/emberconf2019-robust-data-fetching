import Service from '@ember/service';

export default Service.extend({
  delay: 0,

  async load() {
    let response = await fetch('/delay');
    let json = await response.json();

    this.set('delay', json.delay);
  }
});
