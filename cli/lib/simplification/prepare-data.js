import Triangle from "./types/triangle.js";
import Vertex from "./types/vertex.js";

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

  const vertices = positionsGrouped.map(([x, y, z], i) => {
    return new Vertex(x, y, z);
  });

  const indicesGrouped = groupByThree(indicesArray);
  const triangles = indicesGrouped.map(([a, b, c]) => {
    return new Triangle(a, b, c);
  });

  return { triangles, vertices };
};
