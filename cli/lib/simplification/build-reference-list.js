import Reference from "./types/reference.js";

const buildReferenceList = (vertices, triangles) => {
  vertices.forEach((vertex) => {
    vertex.triangles = [];
  });

  triangles.forEach((triangle, i) => {
    triangle.vertices.forEach((vertexIndex, j) => {
      const vertex = vertices[vertexIndex];

      vertex.triangles.push(new Reference(i, j));
    });
  });
};

export default buildReferenceList;
