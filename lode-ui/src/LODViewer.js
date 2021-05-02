import { Box, Center } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as lodeLoader from "lode-three";
import { useEffect, useRef, useState } from "react";
import useBasePath from "./useBasePath";
import useManifest from "./useManifest";
import useParam from "./useParam";
import Infopanel from "./InfoPanel";

const useLode = () => {
  const [lod, setLod] = useState();
  const loadLod = async ({ lodeContext, artifactName }) => {
    const lode = await lodeLoader.loadModel({ lodeContext, artifactName });
    setLod(lode);
  };
  return [lod, loadLod];
};

function LODViewer() {
  const basePath = useBasePath();
  const artifactName = useParam("name");
  const [lod, loadLod] = useLode();
  const nameRef = useRef(null);

  const manifest = useManifest();

  useEffect(() => {
    const manifestNotEmpty = Object.keys(manifest).length > 0;
    const artifactNameChanged = nameRef.current !== artifactName;
    if (manifestNotEmpty && artifactNameChanged) {
      const lodeContext = lodeLoader.createContext({
        basePath: `${basePath}/assets`,
        manifest,
      });
      loadLod({ lodeContext, artifactName });
      nameRef.current = artifactName;
    }
  }, [artifactName, manifest, basePath, loadLod]);

  if (!lod) {
    return (
      <Center h="100%">
        <Spinner />
      </Center>
    );
  }
  return (
    <Box h="100%">
      <Canvas>
        <OrbitControls autoRotate />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <primitive object={lod} />
        <Infopanel object={lod} />
      </Canvas>
    </Box>
  );
}

export default LODViewer;
