import { vec3 } from "gl-matrix";
import buildReferenceList from "./build-reference-list";
import { checkCollapseFlip } from "./check-collapse-flip";
import initializeData from "./initialize-data";
import { prepareData } from "./prepare-data";

describe("checkCollapseFlip", () => {
  const positions = [0, 0, 0, 0, 1, 0, 0, 1, 0];
  const indices = [0, 1, 2];

  it("should skip vertices which are not referenced", () => {
    const { triangles, vertices } = prepareData(positions, indices);
    buildReferenceList(vertices, triangles);
    initializeData(vertices, triangles);
    let point = vec3.create();
    const { flipped } = checkCollapseFlip(
      point,
      0,
      { triangles: [] },
      vertices,
      triangles
    );

    expect(flipped).toBeFalsy();
  });

  it("should report flipping vertices", () => {
    const { triangles, vertices } = prepareData(positions, indices);
    buildReferenceList(vertices, triangles);
    initializeData(vertices, triangles);
    let point = vec3.create();
    const { flipped } = checkCollapseFlip(
      point,
      0,
      vertices[0],
      vertices,
      triangles
    );

    expect(flipped).toBeTruthy();
  });
});
