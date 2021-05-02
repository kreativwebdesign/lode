import { Box, Flex, Spinner } from "@chakra-ui/react";
import { OrbitControls } from "@react-three/drei";
import { Html } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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

function TriangleCount({ url }) {
  const { gl } = useThree();
  const [triangleCount, setTriangleCount] = useState(0);
  useEffect(() => {
    setTriangleCount(0);
    setTimeout(() => {
      setTriangleCount(gl.info.render.triangles);
    }, 500);
  }, [url]);

  if (triangleCount === 0) {
    return null;
  }
  return (
    <Flex
      as={Html}
      fullscreen
      justify="flex-end"
      direction="column"
      pointerEvents="none"
    >
      <Box bg="rgba(255, 255, 255, 0.5)" p={2}>
        Triangle count: {triangleCount}
      </Box>
    </Flex>
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
// renderer.info.render.triangles
