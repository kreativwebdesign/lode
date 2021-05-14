import buildReferenceList from "./build-reference-list";
import identifyBorder from "./identify-border";
import { prepareData } from "./prepare-data";

describe("identifyBorder", () => {
  const pos = [0, 0, 0];
  const positions = [...pos, ...pos, ...pos, ...pos, ...pos];
  // four triangles, which all share one vertex (0)
  const indices = [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1];

  it("should identify border vertices", () => {
    const { triangles, vertices } = prepareData(positions, indices);
    const references = buildReferenceList(vertices, triangles);

    identifyBorder(vertices, triangles, references);

    expect(vertices[0].isBorder).toBeFalsy();
    expect(vertices[1].isBorder).toBeTruthy();
    expect(vertices[2].isBorder).toBeTruthy();
    expect(vertices[3].isBorder).toBeTruthy();
    expect(vertices[4].isBorder).toBeTruthy();
  });
});
