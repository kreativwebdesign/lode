import { prepareData } from "./prepare-data.js";
import buildReferenceList from "./build-reference-list.js";

describe("buildReferenceList", () => {
  const positions = [0, 0, 0, 1, 0, 0, 0, 1, 0];
  const indices = [0, 1, 2];

  it("should generate proper references", () => {
    const { triangles, vertices } = prepareData(positions, indices);
    buildReferenceList(vertices, triangles);
    expect(vertices[0].triangles[0].triangleIndex).toBe(0);
    expect(vertices[0].triangles[0].triangleVertexIndex).toBe(0);
    expect(vertices[1].triangles[0].triangleIndex).toBe(0);
    expect(vertices[1].triangles[0].triangleVertexIndex).toBe(1);
    expect(vertices[2].triangles[0].triangleIndex).toBe(0);
    expect(vertices[2].triangles[0].triangleVertexIndex).toBe(2);
  });
});
