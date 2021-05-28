import { vec3 } from "gl-matrix";
import SymmetricMatrix from "./types/symmetric-matrix.js";
import { calculateTriangleError } from "./error-calculation.js";
import buildReferenceList from "./build-reference-list.js";
import identifyBorder from "./identify-border.js";

const initializeData = (vertices, triangles) => {
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

  buildReferenceList(vertices, triangles);

  identifyBorder(vertices, triangles);
};

export default initializeData;
