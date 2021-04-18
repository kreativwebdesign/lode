export default class Triangle {
  constructor(a, b, c) {
    this.vertices = [a, b, c];
    this.deleted = false;
    this.isDirty = false;
    // TODO: check if using normal from data would be more accurate
    this.normal = null;
    this.error = new Array(4);
  }
}
