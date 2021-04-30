import { NodeIO } from "@gltf-transform/core";
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

  levelDefinitions.forEach(({ pathName, configuration }, level) => {
    const doc = io.read(originalFile);

    const newDoc = doc.clone();

    // currently only one mesh is supported
    newDoc
      .getRoot()
      .listMeshes()[0]
      .listPrimitives()
      .forEach((primitive) => {
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

        // currently the level thresholds are not configurable
        // define target triangles as originalTriangles / 2 ^ (level + 2)
        let targetTriangles = triangles.length * configuration.targetScale;
        // last level should be reduced to 200 triangles
        if (level === levelDefinitions.length - 1) {
          targetTriangles = 200;
        }

        const {
          vertices: newVertices,
          triangles: newTriangles,
        } = simplify(vertices, triangles, { targetTriangles });

        const verticesAsFloat = new Float32Array(newVertices.length * 3);
        newVertices.forEach((v, i) => {
          verticesAsFloat.set(v.position, i * 3);
        });
        positions.setArray(verticesAsFloat);

        const indicesAsInteger = new Uint16Array(newTriangles.length * 3);
        newTriangles.forEach((t, i) => {
          indicesAsInteger.set(t.vertices, i * 3);
        });
        indices.setArray(indicesAsInteger);

        // Remove unprocessed information in order to generate a valid gltf file output
        primitive.setAttribute("NORMAL");
        primitive.setAttribute("TEXCOORD_0");
        primitive.setAttribute("TANGENT");
      });

    io.write(pathName, newDoc);
  });
};
