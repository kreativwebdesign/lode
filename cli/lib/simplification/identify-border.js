// identify boundary of mesh by setting isBorder flag
const identifyBorder = (vertices, triangles, references) => {
  vertices.forEach((vertex) => {
    const vertexIndexToCountMap = new Map();
    for (let i = 0; i < vertex.tCount; i++) {
      const triangleIndex = references[vertex.tStart + i].triangleIndex;
      const triangle = triangles[triangleIndex];
      triangle.vertices.forEach((vertexIndex) => {
        const count = vertexIndexToCountMap.get(vertexIndex) || 0;
        vertexIndexToCountMap.set(vertexIndex, count + 1);
      });
    }

    // mark all borders
    vertexIndexToCountMap.forEach((count, vertexIndex) => {
      // if there is only one triangle on a vertex, it's considered to be a bordering vertex.
      if (count === 1) {
        vertices[vertexIndex].isBorder = true;
      }
    });
  });
};

export default identifyBorder;
