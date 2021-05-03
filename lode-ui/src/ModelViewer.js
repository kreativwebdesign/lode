import { Box, Center, Flex } from "@chakra-ui/layout";
import { useRecoilState } from "recoil";
import LODViewer from "./LODViewer";
import Model from "./Model";
import useBasePath from "./useBasePath";
import useManifest from "./useManifest";
import useParam from "./useParam";
import useUpdateModel from "./useUpdateModel";
import lodLevelState from "./state/lodLevel";
import ArtifactForm from "./ArtifactForm";
import populateDistance from "./helper/populateDistance";

function ModelViewer() {
  const basePath = useBasePath();
  const updateModel = useUpdateModel();
  const name = useParam("name");
  const [lodLevel] = useRecoilState(lodLevelState);

  const manifest = useManifest();

  if (!name) {
    return <Center h="100%">Choose a model on the left</Center>;
  }

  const fileDescription = manifest[name];
  const fileName = name.split("/").pop();
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
        {(levels || []).map((level, i) => {
          return (
            <Box
              h="100%"
              borderLeftWidth={i !== 0 ? 1 : 0}
              key={i}
              background={
                i === lodLevel ? "rgba(200, 200, 200, 0.2)" : undefined
              }
            >
              <Model
                url={`${basePath}/assets/${name}/lod-${i}/${fileName}.gltf`}
              />
              <ArtifactForm
                level={level}
                updateArtifact={(level) => handleUpdate(level, i)}
              />
            </Box>
          );
        })}
      </Flex>
      <Box flexGrow="2">
        <LODViewer />
      </Box>
    </Flex>
  );
}

export default ModelViewer;
