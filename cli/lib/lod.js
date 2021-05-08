import { NodeIO } from "@gltf-transform/core";
import { Document, Accessor } from "@gltf-transform/core";
import simplify from "./simplification/index.js";
import { prepareData } from "./simplification/prepare-data.js";
import * as print from "./helper/print.js";

const io = new NodeIO();

export const copyOriginalArtifact = (pathName, file) => {
  const doc = io.read(file);
  io.write(pathName, doc);
};

/**
 * Main operation to generate lod artifacts for the file in originalFile.
 */
export const performLOD = ({ originalFile, levelDefinitions }) => {
  print.info("performing LOD algorithm on file", originalFile);

  levelDefinitions.forEach(({ pathName, configuration }) => {
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

    // currently only one mesh is supported
    doc
      .getRoot()
      .listMeshes()[0]
      .listPrimitives()
      .forEach((primitive, primitiveIndex) => {
        const attributes = primitive.listAttributes();
        const semantics = primitive.listSemantics();

        const positionIndex = semantics.indexOf("POSITION");

        const positions = attributes[positionIndex];
        const positionsArray = positions.getArray();

        const indices = primitive.getIndices();

        const indicesArray = indices.getArray();

        const { vertices, triangles } = prepareData(
          positionsArray,
          indicesArray
        );

        let targetTriangles = triangles.length * configuration.targetScale;

        const {
          vertices: newVertices,
          triangles: newTriangles,
        } = simplify(vertices, triangles, { targetTriangles });

        const verticesAsFloat = new Float32Array(newVertices.length * 3);
        newVertices.forEach((v, i) => {
          verticesAsFloat.set(v.position, i * 3);
        });

        const indicesAsInteger = new Uint16Array(newTriangles.length * 3);
        newTriangles.forEach((t, i) => {
          indicesAsInteger.set(t.vertices, i * 3);
        });

        const newPrimitive = newDoc.createPrimitive();

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
        newPrimitive.setIndices(indicesAccessor);
        mesh.addPrimitive(newPrimitive);
      });

    io.write(pathName, newDoc);
  });
};
