import { Badge, Box, Center, Flex } from "@chakra-ui/layout";
import { useRecoilState } from "recoil";
import LODViewer from "./LODViewer";
import Model from "./Model";
import useBasePath from "../common/useBasePath";
import useManifest from "../common/useManifest";
import useParam from "../common/useParam";
import useUpdateModel from "../common/useUpdateModel";
import lodLevelState from "../state/lodLevel";
import ArtifactForm from "./ArtifactForm";
import populateDistance from "../helper/populateDistance";

function DetailModel({ level, startingDistance, handleUpdate, isActive, url }) {
  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      h="100%"
      position="relative"
      boxShadow="lg"
    >
      <Model url={url} />
      {isActive && (
        <Box position="absolute" top="0px" right="5px" zIndex={2}>
          <Badge colorScheme="purple">Active</Badge>
        </Box>
      )}
      <Box px={2} pb={2}>
        <ArtifactForm
          level={level}
          updateArtifact={handleUpdate}
          startingDistance={startingDistance}
        />
      </Box>
    </Flex>
  );
}

function ModelViewer() {
  const basePath = useBasePath();
  const name = useParam("name");
  const fileName = (name || "").split("/").pop();
  const updateModel = useUpdateModel();
  const [lodLevel] = useRecoilState(lodLevelState);

  const manifest = useManifest();

  if (!name) {
    return <Center h="100%">Choose a model on the left</Center>;
  }

  const fileDescription = manifest[name];
  const levels = populateDistance(fileDescription);

  const handleUpdate = (artifact, i) => {
    const levels = fileDescription.levels;
    const newFileDescription = {
      ...fileDescription,
      levels: [...levels.slice(0, i), artifact, ...levels.slice(i + 1)],
    };
    updateModel({ name, model: newFileDescription });
  };

  return (
    <Flex direction="column" h="100%">
      <Flex justify="center" borderBottomWidth={1}>
        {(levels || []).map((level, i) => (
          <Box m={4} key={i}>
            <DetailModel
              level={level}
              url={`${basePath}/assets/${name}/lod-${i}/${fileName}.gltf`}
              isActive={i === lodLevel}
              startingDistance={levels[i - 1]?.distance || 0}
              handleUpdate={(level) => handleUpdate(level, i)}
            />
          </Box>
        ))}
      </Flex>
      <Box flexGrow="2">
        <LODViewer />
      </Box>
    </Flex>
  );
}

export default ModelViewer;
