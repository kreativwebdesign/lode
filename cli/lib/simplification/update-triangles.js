import { calculateTriangleError } from "./error-calculation.js";

// Update triangle connections and edge error after an edge is collapsed
const updateTriangles = (i0, vertex, deleted, triangles, vertices) => {
  let deletedTriangles = 0;
  let newReferences = [];
  vertex.triangles.forEach((reference, i) => {
    const { triangleIndex, triangleVertexIndex } = reference;
    const triangle = triangles[triangleIndex];

    if (triangle.deleted) {
      return;
    }

    if (deleted[i]) {
      triangle.deleted = true;
      deletedTriangles++;
      return;
    }

    triangle.vertices[triangleVertexIndex] = i0;
    triangle.isDirty = true;

    calculateTriangleError(triangle, vertices);

    newReferences.push(reference);
  });

  vertex.triangles = newReferences;

  return deletedTriangles;
};

export default updateTriangles;
