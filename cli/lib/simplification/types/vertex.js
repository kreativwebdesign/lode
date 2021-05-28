import { vec3 } from "gl-matrix";
import SymmetricMatrix from "./symmetric-matrix.js";

export default class Vertex {
  constructor(x, y, z) {
    this.position = vec3.fromValues(x, y, z);
    this.q = new SymmetricMatrix();
    // marked if there is only one triangle on a vertex
    this.isBorder = false;
    // list of references
    this.triangles = [];
  }
}
