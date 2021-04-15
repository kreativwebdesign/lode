import { vec3 } from "gl-matrix";
import {
  Vertex,
  SymmetricMatrix,
  prepareData,
  initializeData,
  calculateError,
  calculateVertexError,
  getReferenceList,
  compactTriangles,
} from "./simplify";

describe("simplify", () => {
  const positions = [0, 0, 0, 1, 0, 0, 0, 1, 0];
  const indices = [0, 1, 2];

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

  describe("getReferenceList", () => {
    it("should generate proper references", () => {
      const { triangles, vertices } = prepareData(positions, indices);
      const references = getReferenceList(vertices, triangles);
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
