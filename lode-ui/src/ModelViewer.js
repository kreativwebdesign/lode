import { Box, Center, Flex } from "@chakra-ui/layout";
import Model from "./Model";
import useBasePath from "./useBasePath";
import useManifest from "./useManifest";
import useParam from "./useParam";

function ModelViewer() {
  const basePath = useBasePath();
  const name = useParam("name");

  const manifest = useManifest();

  if (!name) {
    return <Center h="100%">Choose a model on the left</Center>;
  }

  const fileDescription = manifest[name];
  const fileName = name.split("/").pop();

  return (
    <Flex justify="center" borderBottomWidth={1}>
      {(fileDescription?.levels || []).map((_, i) => {
        return (
          <Box h="100%" borderLeftWidth={i !== 0 ? 1 : 0} key={i}>
            <Model
              url={`${basePath}/assets/${name}/lod-${i}/${fileName}.gltf`}
            />
          </Box>
        );
      })}
    </Flex>
  );
}

export default ModelViewer;
