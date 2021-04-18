const compactTriangles = (triangles) => {
  return triangles.filter((triangle) => {
    return !triangle.deleted;
  });
};

export default compactTriangles;
