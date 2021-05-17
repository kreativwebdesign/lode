import { Box, Spinner } from "@chakra-ui/react";
import { OrbitControls } from "@react-three/drei";
import { Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import artifactChangesState from "../state/artifactChanges";
import TriangleCount from "./TriangleCount";

function Model({ url }) {
  const [artifactChanges] = useRecoilState(artifactChangesState);
  return (
    <Box>
      <Canvas>
        <OrbitControls autoRotate />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        <GltfModel url={url} artifactChanges={artifactChanges} />
      </Canvas>
    </Box>
  );
}

function GltfModel({ url, artifactChanges }) {
  const [gltf, set] = useState();
  // trigger a reload also on artifact changes when we get a reload message from the server
  useEffect(() => new GLTFLoader().load(url, set), [url, artifactChanges]);

  if (!gltf) {
    return (
      <Html>
        <Spinner />
      </Html>
    );
  }

  return (
    <>
      <primitive object={gltf.scene} />
      <TriangleCount url={url} />
    </>
  );
}

export default Model;
