import { Box } from "@chakra-ui/layout";
import { Link } from "react-router-dom";
import useManifest from "./useManifest";
import useParam from "./useParam";

function ModelChooser() {
  const manifest = useManifest();
  const modelName = useParam("name");
  return (
    <Box as="ul" p="5" listStyleType="none">
      {Object.entries(manifest || {}).map(([name]) => {
        return (
          <Box as="li" mb="2" key={name}>
            <Box
              as={Link}
              to={`/model?name=${name}`}
              color={modelName === name ? "tomato" : "black"}
            >
              {name}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

export default ModelChooser;
