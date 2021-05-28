/**
 * Stores a reference to a triangle, used in Vertex.js
 */
export default class Reference {
  constructor(triangleIndex, vertexIndex) {
    this.triangleIndex = triangleIndex;
    this.triangleVertexIndex = vertexIndex;
  }
}
