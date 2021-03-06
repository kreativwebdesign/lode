import { Box, Center, Flex } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as lodeLoader from "lode-three";
import { useEffect, useRef, useState } from "react";
import deepEql from "deep-eql";
import useBasePath from "../common/useBasePath";
import useManifest from "../common/useManifest";
import useParam from "../common/useParam";
import Infopanel from "./InfoPanel";
import { useRecoilState } from "recoil";
import lodLevelState from "../state/lodLevel";
import distanceToObjectState from "../state/distanceToObject";
import artifactChangesState from "../state/artifactChanges";
import AnalyseCanvas from "./AnalyseCanvas";

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
  const artifactRef = useRef({});

  const manifest = useManifest();
  const [currentLodLevel, setCurrentLodLevel] = useRecoilState(lodLevelState);
  const [artifactChanges] = useRecoilState(artifactChangesState);
  const [distanceToObject, setDistanceToObject] = useRecoilState(
    distanceToObjectState
  );

  useEffect(() => {
    const manifestNotEmpty = Object.keys(manifest).length > 0;
    const artifactChanged = !deepEql(artifactRef.current, {
      artifactName,
      manifest,
      artifactChanges,
    });
    if (manifestNotEmpty && artifactChanged) {
      const lodeContext = lodeLoader.createContext({
        basePath: `${basePath}/assets`,
        manifest,
      });
      loadLod({ lodeContext, artifactName });
      artifactRef.current = { artifactName, manifest, artifactChanges };
    }
  }, [artifactName, manifest, basePath, loadLod, artifactChanges]);

  if (!lod) {
    return (
      <Center h="100%">
        <Spinner />
      </Center>
    );
  }
  return (
    <Flex h="100%" direction="column" justify="center">
      <Box flexGrow={1}>
        <Canvas>
          <OrbitControls autoRotate />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <primitive object={lod} />
          <AnalyseCanvas
            object={lod}
            setCurrentLodLevel={setCurrentLodLevel}
            setDistanceToObject={setDistanceToObject}
            currentLodLevel={currentLodLevel}
            distanceToObject={distanceToObject}
          />
        </Canvas>
      </Box>
      <Infopanel
        object={lod}
        currentLodLevel={currentLodLevel}
        distanceToObject={distanceToObject}
      />
    </Flex>
  );
}

export default LODViewer;
