export class ScrollAnimation {
  constructor({ beginPoint, endPoint, element, from, to }) {
    this.beginPoint = beginPoint;
    this.endPoint = endPoint;
    this.element = element;
    this.from = from;
    this.to = to;
  }

  helpers = {
    getProportion(from, to, value) {
      if (value < from) return 0;
      if (value > to) return 1;

      const totalDiff = to - from;
      if (totalDiff === 0) return to;

      const diff = value - from;
      return Math.abs(diff / totalDiff);
    },

    trunc(value) {
      return Math.trunc(value * 100) / 100;
    },

    limitToInterval(interval, value) {
      const [begin, end] = interval;
      if (value > end) return end;
      if (value < begin) return begin;
      return value;
    }
  }
  
  calculateCurrentValue() {
    let proportion = this.helpers.getProportion(this.beginPoint, this.endPoint, window.scrollY);
    proportion = this.helpers.trunc(proportion);
    proportion = this.helpers.limitToInterval([0, 1], proportion);

    return this.from + (this.to - this.from) * proportion;
  }

  start() {
    this.scrollHandler();
    window.addEventListener("scroll", this.scrollHandler.bind(this))
  }

  stop() {
    window.removeEventListener("scroll", this.scrollHandler.bind(this));
  }
}

export class RotationYOnScroll extends ScrollAnimation {
  scrollHandler() {
    const value = super.calculateCurrentValue();
    this.element.rotation.y = value;
  }
}