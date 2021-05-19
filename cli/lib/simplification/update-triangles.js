import { calculateTriangleError } from "./error-calculation.js";

// Update triangle connections and edge error after an edge is collapsed
const updateTriangles = (
  i0,
  vertex,
  deleted,
  triangles,
  vertices,
  references
) => {
  let deletedTriangles = 0;
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

    triangle.vertices[reference.triangleVertexIndex] = i0;
    triangle.isDirty = true;

    calculateTriangleError(triangle, vertices);

    references.push(reference);
  }
  return deletedTriangles;
};

export default updateTriangles;
