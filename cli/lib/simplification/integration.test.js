import fs from "fs";
import { prepareData } from "./prepare-data.js";
import simplify from "./index.js";

describe("integration test", () => {
  /**
   * this test uses snapshot practices.
   * if the test fails it does not necessarily mean that there is an error.
   * the main goal of the test is to ensure consistency while refactoring parts of the algorithm.
   * Feel free to update the raw as well as processed data structure if required.
   */
  it("integration snapshot test", () => {
    // raw data contains information parsed from binary glTF buffer
    const { positionsArray, indicesArray } = JSON.parse(
      fs.readFileSync("./test-data/snapshot/raw-data-structure.json", "utf-8")
    );
    // processed contains newVertices and newTriangles which is the return value of the main method.
    const outputData = JSON.parse(
      fs.readFileSync(
        "./test-data/snapshot/processed-data-structure.json",
        "utf-8"
      )
    );

    const { vertices, triangles } = prepareData(positionsArray, indicesArray);

    const newOutput = simplify(vertices, triangles);

    expect(
      JSON.parse(
        JSON.stringify({
          newVertices: newOutput.vertices,
          newTriangles: newOutput.triangles,
        })
      )
    ).toEqual(outputData);
  });
});
