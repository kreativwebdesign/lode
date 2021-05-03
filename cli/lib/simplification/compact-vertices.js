// TODO: add tests
const compactVertices = (triangles, vertices) => {
  let vertexRefList = new Array(vertices.length);

  vertices.forEach((_, i) => {
    vertexRefList[i] = 0;
  });

  triangles.forEach((triangle) => {
    triangle.vertices.forEach((vertexIndex) => {
      vertexRefList[vertexIndex] = 1;
    });
  });

  let newVertices = [];

  vertexRefList = vertexRefList.map((hit, index) => {
    if (hit === 1) {
      newVertices.push(vertices[index]);
      return newVertices.length - 1;
    }
    return false;
  });

  triangles.forEach((triangle) => {
    triangle.vertices = triangle.vertices.map(
      (vertexIndex) => vertexRefList[vertexIndex]
    );
  });

  return { vertices: newVertices, triangles };
};

export default compactVertices;
