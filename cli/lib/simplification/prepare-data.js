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

  const min = [Infinity, Infinity, Infinity];

  positionsGrouped.forEach(([x, y, z]) => {
    min[0] = Math.min(x, min[0]);
    min[1] = Math.min(y, min[1]);
    min[2] = Math.min(z, min[2]);
  });

  const lowestMin = Math.min(min[0], min[1], min[2]);
  const factor = TARGET_FACTOR / lowestMin;

  const vertices = positionsGrouped.map(([x, y, z]) => {
    return new Vertex(x * factor, y * factor, z * factor);
  });

  const indicesGrouped = groupByThree(indicesArray);
  const triangles = indicesGrouped.map(([a, b, c]) => {
    return new Triangle(a, b, c);
  });

  return { triangles, vertices, factor };
};
