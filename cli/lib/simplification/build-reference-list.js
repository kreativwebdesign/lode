import Reference from "./types/reference.js";

const buildReferenceList = (vertices, triangles) => {
  vertices.forEach((vertex) => {
    vertex.tCount = 0;
    vertex.tStart = 0;
  });

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

export default buildReferenceList;
