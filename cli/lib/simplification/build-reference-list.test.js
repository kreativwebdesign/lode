import { prepareData } from "./prepare-data.js";
import buildReferenceList from "./build-reference-list.js";

describe("buildReferenceList", () => {
  const positions = [0, 0, 0, 1, 0, 0, 0, 1, 0];
  const indices = [0, 1, 2];

  it("should generate proper references", () => {
    const { triangles, vertices } = prepareData(positions, indices);
    const references = buildReferenceList(vertices, triangles);
    expect(references[0].triangleIndex).toBe(0);
    expect(references[0].triangleVertexIndex).toBe(0);
    expect(references[1].triangleIndex).toBe(0);
    expect(references[1].triangleVertexIndex).toBe(1);
    expect(references[2].triangleIndex).toBe(0);
    expect(references[2].triangleVertexIndex).toBe(2);
  });
});
