import path from "path";
import { Document, Accessor, NodeIO } from "@gltf-transform/core";
import { vec3 } from "gl-matrix";
import simplify from "./simplification/index.js";
import {
  applyScaleFactor,
  prepareData,
} from "./simplification/prepare-data.js";
import * as print from "./helper/print.js";
import mapMaterial from "./simplification/material-mapper.js";

const io = new NodeIO();

/**
 * Main operation to generate lod artifacts for the file in originalFile.
 */
export const performLOD = async ({ originalFile, levelDefinitions }) => {
  print.info("performing LOD algorithm on file", originalFile);

  for (const { pathName, configuration } of levelDefinitions) {
    const doc = io.read(originalFile);
    const originalNode = doc.getRoot().listNodes()[0];

    const newDoc = new Document();
    const scene = newDoc.createScene("scene");
    const node = newDoc.createNode("node");
    node.setRotation(originalNode.getRotation());
    node.setScale(originalNode.getScale());

    const mesh = newDoc.createMesh("mesh");

    node.setMesh(mesh);
    scene.addChild(node);

    let primitiveIndex = 0;
    // currently only one mesh is supported
    for (const primitive of doc.getRoot().listMeshes()[0].listPrimitives()) {
      primitiveIndex++;
      const basePath = path.dirname(originalFile);

      const baseMaterial = primitive.getMaterial();
      const material = newDoc.createMaterial(`material_${primitiveIndex}`);

      await mapMaterial(baseMaterial, material, basePath);

      // obtain raw structure
      const attributes = primitive.listAttributes();
      const semantics = primitive.listSemantics();

      const positionIndex = semantics.indexOf("POSITION");

      const positions = attributes[positionIndex];
      const positionsArray = positions.getArray();

      const indices = primitive.getIndices();

      const indicesArray = indices.getArray();

      const { vertices, triangles } = prepareData(positionsArray, indicesArray);

      let targetTriangles = triangles.length * configuration.targetScale;

      const factor = applyScaleFactor(vertices);

      // simplify structure
      const {
        vertices: newVertices,
        triangles: newTriangles,
      } = simplify(vertices, triangles, { targetTriangles });

      // convert to glTF compatible format
      const verticesAsFloat = new Float32Array(newVertices.length * 3);
      newVertices.forEach((v, i) => {
        const newPosition = vec3.create();
        vec3.divide(
          newPosition,
          v.position,
          vec3.fromValues(factor, factor, factor)
        );
        verticesAsFloat.set(newPosition, i * 3);
      });

      const indicesAsInteger = new Uint16Array(newTriangles.length * 3);
      newTriangles.forEach((t, i) => {
        indicesAsInteger.set(t.vertices, i * 3);
      });

      const newPrimitive = newDoc.createPrimitive();

      // store information in buffers
      const buffer1 = newDoc.createBuffer(`buffer_${primitiveIndex}_1`);

      const positionAccessor = newDoc
        .createAccessor(`data_${primitiveIndex}_1`)
        .setArray(verticesAsFloat)
        .setType(Accessor.Type.VEC3)
        .setBuffer(buffer1);

      newPrimitive.setAttribute("POSITION", positionAccessor);

      const buffer2 = newDoc.createBuffer(`buffer_${primitiveIndex}_2`);

      const indicesAccessor = newDoc
        .createAccessor(`data_${primitiveIndex}_2`)
        .setArray(indicesAsInteger)
        .setType(Accessor.Type.SCALAR)
        .setBuffer(buffer2);

      // apply data on primitive
      newPrimitive.setIndices(indicesAccessor);
      mesh.addPrimitive(newPrimitive);
      newPrimitive.setMaterial(material);
    }

    // write new file
    io.write(pathName, newDoc);
  }
};
