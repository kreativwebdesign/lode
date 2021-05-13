import SymmetricMatrix from "./types/symmetric-matrix.js";
import { calculateError } from "./error-calculation.js";
import { checkCollapseFlip } from "./check-collapse-flip.js";
import initializeData from "./initialize-data.js";
import buildReferenceList from "./build-reference-list.js";
import compactTriangles from "./compact-triangles.js";
import compactVertices from "./compact-vertices.js";
import updateTriangles from "./update-triangles.js";

const defaultOptions = {
  targetTriangles: 200,
  maxIterations: 100,
  aggressiveness: 7,
};

/**
 * Main Function to simplify a given mesh.
 * Algorithm based on https://www.cs.cmu.edu/~./garland/Papers/quadrics.pdf
 * Iteration approach and threshold values are based on https://github.com/sp4cerat/Fast-Quadric-Mesh-Simplification
 * @param {*} vertices
 * @param {*} triangles
 * @param {*} customOptions Overwrite options to fine tune generated mesh.
 * @returns
 */
const simplify = (vertices, triangles, customOptions = {}) => {
  const { targetTriangles, maxIterations, aggressiveness } = {
    ...defaultOptions,
    ...customOptions,
  };
  let references = initializeData(vertices, triangles);
  let deletedTriangles = 0;
  let initialTriangleCount = triangles.length;

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    if (initialTriangleCount - deletedTriangles <= targetTriangles) {
      break;
    }
    // TODO: do not reinitialize args
    triangles = compactTriangles(triangles);
    references = buildReferenceList(vertices, triangles);

    triangles.forEach((triangle) => {
      triangle.isDirty = false;
    });

    // All triangles with edges below the threshold will be removed
    //
    // The following numbers works well for most models.
    // If it does not, try to adjust the 3 parameters
    //
    const threshold = 0.000000001 * Math.pow(iteration + 3, aggressiveness);

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

  return compactVertices(triangles, vertices);
};

export default simplify;
