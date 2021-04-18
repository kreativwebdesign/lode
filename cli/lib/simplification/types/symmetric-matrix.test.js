import SymmetricMatrix from "./symmetric-matrix.js";

describe("Symmetric Matrix", () => {
  it("should construct base matrix", () => {
    const m = new SymmetricMatrix();
    expect(m.data).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it("should construct plane", () => {
    const m = SymmetricMatrix.makePlane(2, 3, 4, 5);
    expect(m.data).toEqual([4, 6, 8, 10, 9, 12, 15, 16, 20, 25]);
  });

  it("should add matrices", () => {
    let m1 = SymmetricMatrix.makePlane(2, 3, 4, 5);
    const m2 = SymmetricMatrix.makePlane(2, 3, 4, 5);
    m1 = SymmetricMatrix.add(m1, m2);

    expect(m1.data).toEqual([8, 12, 16, 20, 18, 24, 30, 32, 40, 50]);
  });

  it("should calculate determinant", () => {
    const m = SymmetricMatrix.makePlane(2, 3, 4, 5);
    const det = m.det(0, 1, 2, 3, 4, 5, 6, 7, 8);
    expect(det).toEqual(
      4 * 9 * 20 +
        8 * 10 * 16 +
        6 * 12 * 15 -
        8 * 9 * 15 -
        4 * 12 * 16 -
        6 * 10 * 20
    );
  });
});
