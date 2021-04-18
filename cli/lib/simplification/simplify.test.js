import fs from "fs";
import { vec3 } from "gl-matrix";
import Vertex from "./vertex.js";
import SymmetricMatrix from "./symmetric-matrix.js";
import { prepareData } from "./prepare-data.js";
import { calculateError, calculateVertexError } from "./error-calculation.js";
import simplify from "./index.js";
import buildReferenceList from "./build-reference-list.js";
import initializeData from "./initialize-data.js";
import compactTriangles from "./compact-triangles.js";

describe("simplify", () => {
  const positions = [0, 0, 0, 1, 0, 0, 0, 1, 0];
  const indices = [0, 1, 2];

  /**
   * this test uses snapshot practices.
   * if the test fails it does not necessarily mean that there is an error.
   * the main goal of the test is to ensure consistency while refactoring parts of the algorithm.
   * Feel free to update the raw as well as processed data structure if required.
   */
  describe("integration snapshot test", () => {
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

  describe("prepare data", () => {
    it("should construct data structures properly", () => {
      const { triangles, vertices } = prepareData(positions, indices);

      expect(triangles[0].vertices).toEqual([0, 1, 2]);
      // TODO: should not rely on serialization of external lib
      expect(vertices[triangles[0].vertices[0]].position).toEqual(
        vec3.fromValues(0, 0, 0)
      );

      expect(vertices[1].position).toEqual(vec3.fromValues(1, 0, 0));
      expect(vertices[2].position).toEqual(vec3.fromValues(0, 1, 0));
    });
  });

  describe("Symmetric Matrix", () => {
    it("should construct base matrix", () => {
      const m = new SymmetricMatrix();
      expect(m.data).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });

    it("should construct plane", () => {
      const m = SymmetricMatrix.makePlane(2, 3, 4, 5);
      expect(m.data).toEqual([4, 6, 8, 10, 9, 12, 15, 16, 20, 25]);
    });

    it("should add matrices", () => {
      let m1 = SymmetricMatrix.makePlane(2, 3, 4, 5);
      const m2 = SymmetricMatrix.makePlane(2, 3, 4, 5);
      m1 = SymmetricMatrix.add(m1, m2);

      expect(m1.data).toEqual([8, 12, 16, 20, 18, 24, 30, 32, 40, 50]);
    });

    it("should calculate determinant", () => {
      const m = SymmetricMatrix.makePlane(2, 3, 4, 5);
      const det = m.det(0, 1, 2, 3, 4, 5, 6, 7, 8);
      expect(det).toEqual(
        4 * 9 * 20 +
          8 * 10 * 16 +
          6 * 12 * 15 -
          8 * 9 * 15 -
          4 * 12 * 16 -
          6 * 10 * 20
      );
    });
  });

  describe("calculateVertexError", () => {
    it("calculates error", () => {
      const error = calculateVertexError(
        SymmetricMatrix.makePlane(2, 3, 4, 5),
        2,
        3,
        4
      );

      expect(error).toBe(
        4 * 2 * 2 +
          2 * 6 * 2 * 3 +
          2 * 8 * 2 * 4 +
          2 * 10 * 2 +
          9 * 3 * 3 +
          2 * 12 * 3 * 4 +
          2 * 15 * 3 +
          16 * 4 * 4 +
          2 * 20 * 4 +
          25
      );
    });
  });

  describe("calculateError", () => {
    // TODO: use more valuable outputs and test both code branches
    it("calculates error", () => {
      const v1 = new Vertex(2, 3, 4);
      const v2 = new Vertex(1, 2, 3);
      const { error, point } = calculateError(v1, v2);

      expect(error).toBe(0);
      expect(point).toEqual(vec3.fromValues(2, 3, 4));
    });
  });

  describe("initializeData", () => {
    it("should construct normals and q", () => {
      const { triangles, vertices } = prepareData(positions, indices);

      initializeData(vertices, triangles);

      // TODO: make better test setup
      expect(vertices[0].q.data).toEqual([0, 0, 0, 0, 0, 0, 0, 1, 0, 0]);
      expect(triangles[0].normal).toEqual(vec3.fromValues(0, 0, 1));
    });
  });

  describe("buildReferenceList", () => {
    it("should generate proper references", () => {
      const { triangles, vertices } = prepareData(positions, indices);
      const references = buildReferenceList(vertices, triangles);
      expect(references[0].triangleIndex).toBe(0);
      expect(references[0].vertexIndex).toBe(0);
      expect(references[1].triangleIndex).toBe(0);
      expect(references[1].vertexIndex).toBe(1);
      expect(references[2].triangleIndex).toBe(0);
      expect(references[2].vertexIndex).toBe(2);
    });
  });

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
});
