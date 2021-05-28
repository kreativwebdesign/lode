import { vec3 } from "gl-matrix";

// Check if a triangle flips when this edge is removed
export const checkCollapseFlip = (
  newPointAfterCollapse,
  adjacentVertexIndex,
  currentVertex,
  vertices,
  triangles
) => {
  const deletedTriangles = new Array(currentVertex.triangles.length);
  const flipped = currentVertex.triangles.find(
    ({ triangleIndex, triangleVertexIndex }, i) => {
      const triangle = triangles[triangleIndex];
      if (triangle.deleted) {
        return false;
      }

      const id1 = triangle.vertices[(triangleVertexIndex + 1) % 3];
      const id2 = triangle.vertices[(triangleVertexIndex + 2) % 3];

      // delete check
      // if one of the adjacent vertices is the "other vertex" we can mark the triangle as removed
      if (id1 === adjacentVertexIndex || id2 === adjacentVertexIndex) {
        deletedTriangles[i] = true;
        return false;
      }

      const d1 = vec3.create();
      vec3.sub(d1, vertices[id1].position, newPointAfterCollapse);
      vec3.normalize(d1, d1);

      const d2 = vec3.create();
      vec3.sub(d2, vertices[id2].position, newPointAfterCollapse);
      vec3.normalize(d2, d2);

      const dotProduct = vec3.dot(d1, d2);
      if (Math.abs(dotProduct) > 0.999) {
        return true;
      }
      const n = vec3.create();
      vec3.cross(n, d1, d2);
      vec3.normalize(n, n);
      deletedTriangles[i] = false;

      if (vec3.dot(n, triangle.normal) < 0.2) {
        return true;
      }
    }
  );

  return { flipped, deletedTriangles };
};
