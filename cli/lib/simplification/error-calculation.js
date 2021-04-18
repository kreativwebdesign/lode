import { vec3 } from "gl-matrix";
import SymmetricMatrix from "./types/symmetric-matrix.js";

export const calculateVertexError = (q, point) => {
  const x = point[0];
  const y = point[1];
  const z = point[2];
  const m = q.data;
  return (
    m[0] * x * x +
    2 * m[1] * x * y +
    2 * m[2] * x * z +
    2 * m[3] * x +
    m[4] * y * y +
    2 * m[5] * y * z +
    2 * m[6] * y +
    m[7] * z * z +
    2 * m[8] * z +
    m[9]
  );
};

/**
 * Find optimal solution for given qDelta
 * @param {*} qDelta Invertible matrix
 * @param {*} det
 * @returns
 */
const findOptimalVertexPosition = (qDelta, det) => {
  let resultPoint = vec3.create();
  // x = A41 / det(qDelta)
  resultPoint[0] = (-1 / det) * qDelta.det(1, 2, 3, 4, 5, 6, 5, 7, 8);

  // y = A42 / det(qDelta)
  resultPoint[1] = (1 / det) * qDelta.det(0, 2, 3, 1, 5, 6, 2, 7, 8);

  // z = A43 / det(qDelta)
  resultPoint[2] = (-1 / det) * qDelta.det(0, 1, 3, 1, 4, 6, 2, 5, 8);

  const error = calculateVertexError(qDelta, resultPoint);
  return { error, point: resultPoint };
};

const takeSimpleVertexPosition = (vertex1, vertex2, qDelta) => {
  let resultPoint = vec3.create();
  const vertex3Position = vec3.create();
  vec3.add(vertex3Position, vertex1.position, vertex2.position);
  vec3.divide(vertex3Position, vertex3Position, vec3.fromValues(2, 2, 2));

  const error1 = calculateVertexError(qDelta, vertex1.position);
  const error2 = calculateVertexError(qDelta, vertex2.position);
  const error3 = calculateVertexError(qDelta, vertex3Position);
  const error = Math.min(error1, error2, error3);
  if (error1 === error) {
    vec3.copy(resultPoint, vertex1.position);
  } else if (error2 === error) {
    vec3.copy(resultPoint, vertex2.position);
  } else if (error3 === error) {
    vec3.copy(resultPoint, vertex3Position);
  }

  return { error, point: resultPoint };
};

// error for one edge
export const calculateError = (vertex1, vertex2) => {
  // compute interpolated vertex
  const qDelta = SymmetricMatrix.add(vertex1.q, vertex2.q);
  const isBorder = vertex1.isBorder && vertex2.isBorder;

  // determinant is used to check if matrix is invertible
  let det = qDelta.det(0, 1, 2, 1, 4, 5, 2, 5, 7);

  if (det != 0 && !isBorder) {
    // matrix is invertible, we can therefore look for the optimal solution
    return findOptimalVertexPosition(qDelta, det);
  } else {
    // determinant is zero, therefore it's not possible to take optimal solution
    // for borders it's often an issue with creases, in these cases the simple approach delivers more appropriate results
    return takeSimpleVertexPosition(vertex1, vertex2, qDelta);
  }
};

export const calculateTriangleError = (triangle, vertices) => {
  triangle.vertices.forEach((vertexIndex, i) => {
    const nextVertexIndex = triangle.vertices[(i + 1) % 3];
    const { error } = calculateError(
      vertices[vertexIndex],
      vertices[nextVertexIndex]
    );
    triangle.error[i] = error;
  });
  triangle.error[3] = Math.min(
    triangle.error[0],
    triangle.error[1],
    triangle.error[2]
  );
};
