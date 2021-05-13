/**
 * symmetric 4x4 matrix
 */
export default class SymmetricMatrix {
  constructor() {
    this.data = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.data[i] = 0;
    }
  }

  static makePlane(a, b, c, d) {
    const m = new SymmetricMatrix();
    m.data[0] = a * a;
    m.data[1] = a * b;
    m.data[2] = a * c;
    m.data[3] = a * d;
    m.data[4] = b * b;
    m.data[5] = b * c;
    m.data[6] = b * d;
    m.data[7] = c * c;
    m.data[8] = c * d;
    m.data[9] = d * d;
    return m;
  }

  static add(a, b) {
    const m = new SymmetricMatrix();
    for (let i = 0; i < 10; i++) {
      m.data[i] = a.data[i] + b.data[i];
    }
    return m;
  }

  det(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
    const m = this.data;
    return (
      m[m11] * m[m22] * m[m33] +
      m[m13] * m[m21] * m[m32] +
      m[m12] * m[m23] * m[m31] -
      m[m13] * m[m22] * m[m31] -
      m[m11] * m[m23] * m[m32] -
      m[m12] * m[m21] * m[m33]
    );
  }
}
