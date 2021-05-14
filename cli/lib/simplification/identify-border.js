// identify boundary of mesh by setting isBorder flag
const identifyBorder = (vertices, triangles, references) => {
  vertices.forEach((vertex) => {
    const vertexCounts = [];
    const vertexIndexes = [];
    for (let i = 0; i < vertex.tCount; i++) {
      const triangleIndex = references[vertex.tStart + i].triangleIndex;
      const triangle = triangles[triangleIndex];
      triangle.vertices.forEach((vertexIndex) => {
        let offset = vertexIndexes.indexOf(vertexIndex);
        if (offset === -1) {
          vertexCounts.push(1);
          vertexIndexes.push(vertexIndex);
        } else {
          vertexCounts[offset]++;
        }
      });
    }
    vertexCounts.forEach((vertexCount, index) => {
      if (vertexCount === 1) {
        vertices[vertexIndexes[index]].isBorder = true;
      }
    });
  });
};

export default identifyBorder;
