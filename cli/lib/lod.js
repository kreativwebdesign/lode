import { NodeIO } from "@gltf-transform/core";
import { simplify } from "./simplification/simplify.js";
import { prepareData } from "./simplification/prepare-data.js";
import * as print from "./print.js";

const io = new NodeIO();

export const copyOriginalArtifact = (pathName, file) => {
  const doc = io.read(file);
  io.write(pathName, doc);
};

export const performLOD = (pathName, file) => {
  print.info("performing LOD algorithm on file", file);

  const doc = io.read(file);

  const newDoc = doc.clone();

  // currently only one mesh is supported
  const primitive = newDoc.getRoot().listMeshes()[0].listPrimitives()[0];

  const attributes = primitive.listAttributes();
  const semantics = primitive.listSemantics();

  const positionIndex = semantics.indexOf("POSITION");

  const positions = attributes[positionIndex];
  const positionsArray = positions.getArray();

  const indices = primitive.getIndices();

  const indicesArray = indices.getArray();

  const { vertices, triangles } = prepareData(positionsArray, indicesArray);

  const { vertices: newVertices, triangles: newTriangles } = simplify(
    vertices,
    triangles
  );

  const newPositions = newVertices.reduce((agg, v) => {
    return [...agg, v.position[0], v.position[1], v.position[2]];
  }, []);
  positions.setArray(new Float32Array(newPositions));

  const newIndices = newTriangles.reduce((agg, t) => {
    return [...agg, t.vertices[0], t.vertices[1], t.vertices[2]];
  }, []);
  indices.setArray(new Uint16Array(newIndices));

  // Remove unprocessed information in order to generate a valid gltf file output
  primitive.setAttribute("NORMAL");
  primitive.setAttribute("TEXCOORD_0");
  primitive.setAttribute("TANGENT");

  io.write(pathName, newDoc);
};
