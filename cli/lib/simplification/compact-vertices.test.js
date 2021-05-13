import compactVertices from "./compact-vertices.js";

describe("compactVertices", () => {
  it("should remove deleted vertices", () => {
    const { vertices } = compactVertices(
      [
        {
          vertices: [0, 1, 3],
        },
      ],
      [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
    );

    expect(vertices).toEqual([
      {
        id: 0,
      },
      {
        id: 1,
      },
      {
        id: 3,
      },
    ]);
  });
});
