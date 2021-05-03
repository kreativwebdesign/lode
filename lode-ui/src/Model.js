import { Box, Spinner } from "@chakra-ui/react";
import { OrbitControls } from "@react-three/drei";
import { Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import TriangleCount from "./TriangleCount";

function Model({ url }) {
  return (
    <Box>
      <Canvas>
        <OrbitControls autoRotate />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        <GltfModel url={url} />
      </Canvas>
    </Box>
  );
}

function GltfModel({ url }) {
  const [gltf, set] = useState();
  useMemo(() => new GLTFLoader().load(url, set), [url]);

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
