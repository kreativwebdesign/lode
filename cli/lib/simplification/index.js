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
  initializeData(vertices, triangles);
  let deletedTriangles = 0;
  let initialTriangleCount = triangles.length;

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    // check if targetTriangles are reached
    if (initialTriangleCount - deletedTriangles <= targetTriangles) {
      break;
    }

    triangles = compactTriangles(triangles);
    buildReferenceList(vertices, triangles);

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

          // don't remove if flipped
          const {
            flipped: flippedOnFirst,
            deletedTriangles: deleted0,
          } = checkCollapseFlip(
            point,
            vertexIndex1,
            vertex0,
            vertices,
            triangles
          );
          if (flippedOnFirst) {
            return;
          }

          const {
            flipped: flippedOnSecond,
            deletedTriangles: deleted1,
          } = checkCollapseFlip(
            point,
            vertexIndex0,
            vertex1,
            vertices,
            triangles
          );
          if (flippedOnSecond) {
            return;
          }

          // not flipped, therefore we can remove edge

          // replace vertex with new optimal point
          vertex0.position = point;
          // calculate error
          vertex0.q = SymmetricMatrix.add(vertex0.q, vertex1.q);

          deletedTriangles += updateTriangles(
            vertexIndex0,
            vertex0,
            deleted0,
            triangles,
            vertices
          );
          deletedTriangles += updateTriangles(
            vertexIndex0,
            vertex1,
            deleted1,
            triangles,
            vertices
          );
        }
      });
    });
  }

  return compactVertices(triangles, vertices);
};

export default simplify;
