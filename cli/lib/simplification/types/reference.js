export default class Reference {
  constructor(triangleIndex, vertexIndex) {
    this.triangleIndex = triangleIndex;
    // TODO: rename to triangleVertexIndex as it's not vertex index but index of vertex in triangle vertices array
    this.vertexIndex = vertexIndex;
  }
}
