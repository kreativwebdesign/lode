import { vec3 } from "gl-matrix";

/**
 * symmetric 4x4 matrix
 */
export class SymmetricMatrix {
  constructor() {
    // TODO: maybe use more specialized array?
    this.data = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.data[i] = 0;
    }
  }

  static makePlane(a, b, c, d) {
    const m = new SymmetricMatrix();
    m.data[0] = a * a;
    m.data[1] = a * b;
    m.data[2] = a * c;
    m.data[3] = a * d;
    m.data[4] = b * b;
    m.data[5] = b * c;
    m.data[6] = b * d;
    m.data[7] = c * c;
    m.data[8] = c * d;
    m.data[9] = d * d;
    return m;
  }

  static add(a, b) {
    const m = new SymmetricMatrix();
    for (let i = 0; i < 10; i++) {
      m.data[i] = a.data[i] + b.data[i];
    }
    return m;
  }

  det(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
    const m = this.data;
    return (
      m[m11] * m[m22] * m[m33] +
      m[m13] * m[m21] * m[m32] +
      m[m12] * m[m23] * m[m31] -
      m[m13] * m[m22] * m[m31] -
      m[m11] * m[m23] * m[m32] -
      m[m12] * m[m21] * m[m33]
    );
  }
}

export class Triangle {
  constructor(a, b, c) {
    this.vertices = [a, b, c];
    this.deleted = false;
    this.isDirty = false;
    // TODO: check if using normal from data would be more accurate
    this.normal = null;
    this.error = new Array(4);
  }
}

export class Vertex {
  constructor(x, y, z) {
    this.position = vec3.fromValues(x, y, z);
    this.q = new SymmetricMatrix();
    this.isBorder = false;
    this.tStart = 0;
    this.tCount = 0;
  }
}

export class Reference {
  constructor(triangleIndex, vertexIndex) {
    this.triangleIndex = triangleIndex;
    // TODO: rename to triangleVertexIndex as it's not vertex index but index of vertex in triangle vertices array
    this.vertexIndex = vertexIndex;
  }
}

export const prepareData = (positionsArray, indicesArray) => {
  const groupByThree = (arr) => {
    return arr.reduce((agg, coordinate) => {
      let last = agg[agg.length - 1];
      if (!last || last.length === 3) {
        last = [];
        agg.push(last);
      }
      last.push(coordinate);
      return agg;
    }, []);
  };

  const positionsGrouped = groupByThree(positionsArray);

  const vertices = positionsGrouped.map(([x, y, z], i) => {
    return new Vertex(x, y, z);
  });

  const indicesGrouped = groupByThree(indicesArray);
  const triangles = indicesGrouped.map(([a, b, c]) => {
    return new Triangle(a, b, c);
  });

  return { triangles, vertices };
};

// TODO: maybe accept vec3?
export const calculateVertexError = (q, x, y, z) => {
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

// error for one edge
export const calculateError = (vertex1, vertex2) => {
  // compute interpolated vertex
  const qDelta = SymmetricMatrix.add(vertex1.q, vertex2.q);
  const isBorder = vertex1.isBorder && vertex2.isBorder;
  let error = 0;
  let resultPoint = vec3.create();
  // determinant is used to check if matrix is invertible
  let det = qDelta.det(0, 1, 2, 1, 4, 5, 2, 5, 7);

  if (det != 0 && !isBorder) {
    // qDelta is invertible
    // vx = A41/det(q_delta)
    resultPoint[0] = (-1 / det) * qDelta.det(1, 2, 3, 4, 5, 6, 5, 7, 8);

    // vy = A42/det(q_delta)
    resultPoint[1] = (1 / det) * qDelta.det(0, 2, 3, 1, 5, 6, 2, 7, 8);

    // vz = A43/det(q_delta)
    resultPoint[2] = (-1 / det) * qDelta.det(0, 1, 3, 1, 4, 6, 2, 5, 8);

    error = calculateVertexError(
      qDelta,
      resultPoint[0],
      resultPoint[1],
      resultPoint[2]
    );
  } else {
    // det = 0 -> find optimal vertex along edge

    const vertex3Position = vec3.create();
    vec3.add(vertex3Position, vertex1.position, vertex2.position);
    vec3.divide(vertex3Position, vertex3Position, vec3.fromValues(2, 2, 2));

    const error1 = calculateVertexError(
      qDelta,
      vertex1.position[0],
      vertex1.position[1],
      vertex1.position[2]
    );
    const error2 = calculateVertexError(
      qDelta,
      vertex2.position[0],
      vertex2.position[1],
      vertex2.position[2]
    );
    const error3 = calculateVertexError(
      qDelta,
      vertex3Position[0],
      vertex3Position[1],
      vertex3Position[2]
    );
    error = Math.min(error1, error2, error3);
    if (error1 === error) {
      vec3.copy(resultPoint, vertex1.position);
    } else if (error2 === error) {
      vec3.copy(resultPoint, vertex2.position);
    } else if (error3 === error) {
      vec3.copy(resultPoint, vertex3Position);
    }
  }

  return { error, point: resultPoint };
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

export const initializeData = (vertices, triangles) => {
  triangles.forEach((triangle) => {
    const points = triangle.vertices.map((vertexIndex) => {
      return vertices[vertexIndex].position;
    });

    // calculate normal of triangle
    let normal = vec3.create();
    let diff1 = vec3.create();
    let diff2 = vec3.create();
    vec3.sub(diff1, points[1], points[0]);
    vec3.sub(diff2, points[2], points[0]);
    vec3.cross(normal, diff1, diff2);
    vec3.normalize(normal, normal);
    triangle.normal = normal;

    // calculate initial Q of vertices
    triangle.vertices.forEach((vertexIndex) => {
      const vertex = vertices[vertexIndex];
      const matrix = SymmetricMatrix.makePlane(
        normal[0],
        normal[1],
        normal[2],
        -vec3.dot(normal, points[0])
      );
      vertex.q = SymmetricMatrix.add(vertex.q, matrix);
    });
  });

  triangles.forEach((triangle) => {
    calculateTriangleError(triangle, vertices);
  });

  const references = getReferenceList(vertices, triangles);

  // identify boundary of mesh (isBorder)
  // TODO: extract and test
  let vertexCounts;
  let vertexIndexes;
  vertices.forEach((vertex) => {
    vertexCounts = [];
    vertexIndexes = [];
    for (let i = 0; i < vertex.tCount; i++) {
      const triangleIndex = references[vertex.tStart + i].triangleIndex;
      const triangle = triangles[triangleIndex];
      triangle.vertices.forEach((vertexIndex) => {
        let offset = vertexIndexes.indexOf(vertexIndex);
        if (offset === -1) {
          offset = vertexCounts.length;
        }

        if (offset === vertexCounts.length) {
          vertexCounts.push(1);
          vertexIndexes.push(vertexIndex);
        } else {
          vertexCounts[offset]++;
        }
      });
    }
    vertexCounts.forEach((vertexCount, index) => {
      if (vertexCount === 1) {
        vertices[vertexIndexes[index]].isBorder = true;
      }
    });
  });

  return references;
};

export const getReferenceList = (vertices, triangles) => {
  // init reference counters
  triangles.forEach((triangle) => {
    triangle.vertices.forEach((vertexIndex) => {
      vertices[vertexIndex].tCount++;
    });
  });
  let tStart = 0;
  vertices.forEach((vertex) => {
    vertex.tStart = tStart;
    tStart += vertex.tCount;
    vertex.tCount = 0;
  });

  // Write References
  let references = new Array(triangles.length * 3);

  triangles.forEach((triangle, i) => {
    triangle.vertices.forEach((vertexIndex, j) => {
      const vertex = vertices[vertexIndex];
      references[vertex.tStart + vertex.tCount] = new Reference(i, j);
      vertex.tCount++;
    });
  });
  return references;
};

export const compactTriangles = (triangles) => {
  return triangles.filter((triangle) => {
    return !triangle.deleted;
  });
};

// TODO: add unit test
// Check if a triangle flips when this edge is removed
export const flipped = (
  point,
  index1,
  vertex0,
  deleted,
  vertices,
  triangles,
  references
) => {
  for (let i = 0; i < vertex0.tCount; i++) {
    const triangle = triangles[references[vertex0.tStart + i].triangleIndex];
    if (triangle.deleted) {
      continue;
    }

    const vertexIndex = references[vertex0.tStart + i].vertexIndex;
    const id1 = triangle.vertices[(vertexIndex + 1) % 3];
    const id2 = triangle.vertices[(vertexIndex + 2) % 3];

    // delete check
    if (id1 === index1 || id2 === index1) {
      deleted[i] = true;
      continue;
    }

    const d1 = vec3.create();
    vec3.sub(d1, vertices[id1].position, point);
    vec3.normalize(d1, d1);

    const d2 = vec3.create();
    vec3.sub(d2, vertices[id2].position, point);
    vec3.normalize(d2, d2);

    const dotProduct = vec3.dot(d1, d2);
    if (Math.abs(dotProduct) > 0.999) {
      return true;
    }
    const n = vec3.create();
    vec3.cross(n, d1, d2);
    vec3.normalize(n, n);
    deleted[i] = false;

    if (vec3.dot(n, triangle.normal) < 0.2) {
      return true;
    }
  }
  return false;
};

// TODO: add unit test
// Update triangle connections and edge error after an edge is collapsed
export const updateTriangles = (
  i0,
  vertex,
  deleted,
  deletedTriangles,
  triangles,
  vertices,
  references
) => {
  for (let i = 0; i < vertex.tCount; i++) {
    const reference = references[vertex.tStart + i];
    const triangle = triangles[reference.triangleIndex];

    if (triangle.deleted) {
      continue;
    }

    if (deleted[i]) {
      triangle.deleted = true;
      deletedTriangles++;
      continue;
    }

    triangle.vertices[reference.vertexIndex] = i0;
    triangle.isDirty = true;

    calculateTriangleError(triangle, vertices);

    references.push(reference);
  }
  return deletedTriangles;
};

const MAX_ITERATIONS = 100;

/**
 * Main Function to simplify a given mesh
 * Iteration approach and threshold values are based on https://github.com/sp4cerat/Fast-Quadric-Mesh-Simplification
 * @param {*} vertices
 * @param {*} triangles
 * @param {*} targetTriangles Target threshold of triangles to reach
 * @returns
 */
export const simplify = (vertices, triangles, targetTriangles = 200) => {
  let agressiveness = 7;

  let references = initializeData(vertices, triangles);
  let deletedTriangles = 0;
  let initialTriangleCount = triangles.length;

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    if (initialTriangleCount - deletedTriangles <= targetTriangles) {
      break;
    }
    // TODO: do not reinitialize args
    triangles = compactTriangles(triangles);
    references = getReferenceList(vertices, triangles);

    triangles.forEach((triangle) => {
      triangle.isDirty = false;
    });

    // TODO: threshold might have to be tuned later on
    // All triangles with edges below the threshold will be removed
    //
    // The following numbers works well for most models.
    // If it does not, try to adjust the 3 parameters
    //
    const threshold = 0.000000001 * Math.pow(iteration + 3, agressiveness);

    // remove vertices & mark deleted triangles
    triangles.forEach((triangle) => {
      if (triangle.error[3] > threshold) return;
      if (triangle.deleted) return;
      if (triangle.isDirty) return;

      triangle.vertices.forEach((vertexIndex, index) => {
        if (triangle.error[index] < threshold) {
          const vertexIndex0 = vertexIndex;
          const vertex0 = vertices[vertexIndex0];
          const vertexIndex1 = triangle.vertices[(index + 1) % 3];
          const vertex1 = vertices[vertexIndex1];

          if (vertex0.isBorder !== vertex1.isBorder) {
            return;
          }

          // compute vertex to collapse to
          const { point } = calculateError(vertex0, vertex1);

          const deleted0 = new Array(vertex0.tCount);
          const deleted1 = new Array(vertex1.tCount);

          // don't remove if flipped
          if (
            flipped(
              point,
              vertexIndex1,
              vertex0,
              deleted0,
              vertices,
              triangles,
              references
            )
          ) {
            return;
          }
          if (
            flipped(
              point,
              vertexIndex0,
              vertex1,
              deleted1,
              vertices,
              triangles,
              references
            )
          ) {
            return;
          }

          // not flipped, therefore we can remove edge

          // replace vertex with new optimal point
          vertex0.position = point;
          // calculate error
          vertex0.q = SymmetricMatrix.add(vertex0.q, vertex1.q);
          let tStart = references.length;

          deletedTriangles = updateTriangles(
            vertexIndex0,
            vertex0,
            deleted0,
            deletedTriangles,
            triangles,
            vertices,
            references
          );
          deletedTriangles = updateTriangles(
            vertexIndex0,
            vertex1,
            deleted1,
            deletedTriangles,
            triangles,
            vertices,
            references
          );

          let tCount = references.length - tStart;

          if (tCount <= vertex0.tCount) {
            if (tCount > 0) {
              for (let refIdx = 0; refIdx < tCount; refIdx++) {
                references[vertex0.tStart + refIdx] =
                  references[tStart + refIdx];
              }
            }
          } else {
            vertex0.tStart = tStart;
          }

          vertex0.tCount = tCount;
          return;
        }

        // TODO: check if target threshold is reached
      });
    });
  }

  return { vertices, triangles };
};
