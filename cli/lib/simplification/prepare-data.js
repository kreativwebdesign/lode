import { vec3 } from "gl-matrix";
import Triangle from "./types/triangle.js";
import Vertex from "./types/vertex.js";

const TARGET_FACTOR = 100;

export const prepareData = (positionsArray, indicesArray) => {
  const groupByThree = (arr) => {
    return arr.reduce((agg, coordinate) => {
      let last = agg[agg.length - 1];
      if (!last || last.length === 3) {
        last = [];
        agg.push(last);
      }
      last.push(coordinate);
      return agg;
    }, []);
  };

  const positionsGrouped = groupByThree(positionsArray);

  const vertices = positionsGrouped.map(([x, y, z]) => {
    return new Vertex(x, y, z);
  });

  const indicesGrouped = groupByThree(indicesArray);
  const triangles = indicesGrouped.map(([a, b, c]) => {
    return new Triangle(a, b, c);
  });

  return { triangles, vertices };
};

export const applyScaleFactor = (vertices) => {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];

  vertices.forEach((vertex) => {
    min[0] = Math.min(vertex.position[0], min[0]);
    min[1] = Math.min(vertex.position[1], min[1]);
    min[2] = Math.min(vertex.position[2], min[2]);
  });

  let lowestMin = Math.min(min[0], min[1], min[2]);
  if (lowestMin === 0) {
    lowestMin = 0.001;
  }
  const factor = TARGET_FACTOR / lowestMin;

  vertices.forEach((vertex) => {
    vec3.multiply(
      vertex.position,
      vertex.position,
      vec3.fromValues(factor, factor, factor)
    );
  });

  return factor;
};
