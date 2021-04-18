import { vec3 } from "gl-matrix";
import { prepareData } from "./prepare-data.js";
import initializeData from "./initialize-data.js";

describe("initializeData", () => {
  const positions = [0, 0, 0, 1, 0, 0, 0, 1, 0];
  const indices = [0, 1, 2];

  it("should construct normals and q", () => {
    const { triangles, vertices } = prepareData(positions, indices);

    initializeData(vertices, triangles);

    // TODO: make better test setup
    expect(vertices[0].q.data).toEqual([0, 0, 0, 0, 0, 0, 0, 1, 0, 0]);
    expect(triangles[0].normal).toEqual(vec3.fromValues(0, 0, 1));
  });
});
