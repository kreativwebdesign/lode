import { vec3 } from "gl-matrix";
import { prepareData } from "./prepare-data.js";

describe("prepare data", () => {
  const positions = [0, 0, 0, 1, 0, 0, 0, 1, 0];
  const indices = [0, 1, 2];

  it("should construct data structures properly", () => {
    const { triangles, vertices } = prepareData(positions, indices);

    expect(triangles[0].vertices).toEqual([0, 1, 2]);

    expect(vertices[triangles[0].vertices[0]].position).toEqual(
      vec3.fromValues(0, 0, 0)
    );

    expect(vertices[1].position).toEqual(vec3.fromValues(1, 0, 0));
    expect(vertices[2].position).toEqual(vec3.fromValues(0, 1, 0));
  });
});
