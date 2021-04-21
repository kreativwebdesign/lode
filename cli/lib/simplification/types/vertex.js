import { vec3 } from "gl-matrix";
import SymmetricMatrix from "./symmetric-matrix.js";

export default class Vertex {
  constructor(x, y, z) {
    this.position = vec3.fromValues(x, y, z);
    this.q = new SymmetricMatrix();
    this.isBorder = false;
    this.tStart = 0;
    this.tCount = 0;
  }
}