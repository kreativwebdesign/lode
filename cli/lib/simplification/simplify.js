import { vec3 } from "gl-matrix";
import SymmetricMatrix from "./symmetric-matrix.js";
import Reference from "./reference.js";
import { calculateError, calculateTriangleError } from "./error-calculation.js";
import { checkCollapseFlip } from "./check-collapse-flip.js";

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
const AGGRESSIVENESS = 7;

/**
 * Main Function to simplify a given mesh
 * Algorithm based on https://www.cs.cmu.edu/~./garland/Papers/quadrics.pdf
 * Iteration approach and threshold values are based on https://github.com/sp4cerat/Fast-Quadric-Mesh-Simplification
 * @param {*} vertices
 * @param {*} triangles
 * @param {*} targetTriangles Target threshold of triangles to reach
 * @returns
 */
export const simplify = (vertices, triangles, targetTriangles = 200) => {
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
    const threshold = 0.000000001 * Math.pow(iteration + 3, AGGRESSIVENESS);

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
            checkCollapseFlip(
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
            checkCollapseFlip(
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
