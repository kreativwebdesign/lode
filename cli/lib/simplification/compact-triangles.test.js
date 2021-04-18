import compactTriangles from "./compact-triangles.js";

describe("compactTriangles", () => {
  it("should remove deleted triangles", () => {
    let newTriangles = compactTriangles([
      { deleted: true },
      { deleted: true },
      { deleted: false },
    ]);
    expect(newTriangles.length).toBe(1);
  });
});
