import { vec3 } from "gl-matrix";

// TODO: add unit test
// Check if a triangle flips when this edge is removed
export const checkCollapseFlip = (
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
