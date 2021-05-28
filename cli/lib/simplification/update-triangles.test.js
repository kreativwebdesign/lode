import buildReferenceList from "./build-reference-list.js";
import initializeData from "./initialize-data.js";
import { prepareData } from "./prepare-data.js";
import updateTriangles from "./update-triangles.js";

describe("updateTriangles", () => {
  it("should remove deleted triangles", () => {
    const positions = [0, 0, 0, 0, 1, 0, 0, 1, 0];
    const indices = [0, 1, 2];
    const { triangles, vertices } = prepareData(positions, indices);
    buildReferenceList(vertices, triangles);
    initializeData(vertices, triangles);
    const deletedTriangles = updateTriangles(
      0,
      vertices[0],
      [true],
      triangles,
      vertices
    );

    expect(deletedTriangles).toBe(1);
  });
});
