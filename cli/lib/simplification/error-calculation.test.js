import { vec3 } from "gl-matrix";
import { calculateError, calculateVertexError } from "./error-calculation.js";
import SymmetricMatrix from "./types/symmetric-matrix.js";
import Vertex from "./types/vertex.js";

describe("error calculation", () => {
  describe("calculateVertexError", () => {
    it("should calculate vertex error", () => {
      const error = calculateVertexError(
        SymmetricMatrix.makePlane(2, 3, 4, 5),
        vec3.fromValues(2, 3, 4)
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
    it("should calculate error for simple points", () => {
      const v1 = new Vertex(2, 3, 4);
      const v2 = new Vertex(1, 2, 3);
      const { error, point } = calculateError(v1, v2);

      expect(error).toBe(0);
      expect(point).toEqual(vec3.fromValues(2, 3, 4));
    });

    it("should find optimal solution", () => {
      const v1 = new Vertex(2, 3, 4);
      v1.q = new SymmetricMatrix();
      v1.q = SymmetricMatrix.add(v1.q, {
        data: [
          0.23113015788519192,
          1.016843752324856,
          -0.36678078018215443,
          5.030903120047265,
          5.129066378702209,
          -1.6415259662113328,
          15.425474849088516,
          0.639803472070898,
          -9.429901252734453,
          231.15708260543923,
        ],
      });
      const v2 = new Vertex(1, 2, 3);
      v2.q = new SymmetricMatrix();
      v2.q = SymmetricMatrix.add(v2.q, {
        data: [
          0.03957957982268185,
          0.33248897773820224,
          -0.06705418464906408,
          -0.8305163732209331,
          5.8406713298397825,
          -0.5610046168751708,
          -37.8428008878439,
          0.11974909411243273,
          1.2198783117627228,
          334.41441877433635,
        ],
      });
      const { error, point } = calculateError(v1, v2);

      expect(error).toBe(1.7465097644826528);
      expect(point).toEqual(
        vec3.fromValues(
          -20.479013442993164,
          10.494335174560547,
          29.543190002441406
        )
      );
    });
  });
});
