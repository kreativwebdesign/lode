import { vec3 } from "gl-matrix";
import { calculateError, calculateVertexError } from "./error-calculation.js";
import SymmetricMatrix from "./symmetric-matrix.js";
import Vertex from "./vertex.js";

describe("error calculation", () => {
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
});
