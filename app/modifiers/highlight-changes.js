import { Modifier } from 'ember-oo-modifiers';

const HighlightChanges = Modifier.extend({
  didReceiveArguments(args, props) {
    if (this.key !== props.key) {
      this.teardownObserver();
      this.setupObserver();
    }

    this.set('key', props.key);
  },

  didInsertElement() {
    this.setupObserver();
  },

  willDestroyElement() {
    this.element.onanimationend = null;
    this.teardownObserver();
  },

  setupObserver() {
    let observer = new MutationObserver(() => {
      this.element.addEventListener('animationend', () => {
        this.element.classList.remove('highlight');
      });

      this.element.classList.add('highlight');
    });

    observer.observe(this.element, {
      characterData: true,
      childList: true,
      subtree: true
    });

    this.set('observer', observer);
  },

  teardownObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
});

export default Modifier.modifier(HighlightChanges);
