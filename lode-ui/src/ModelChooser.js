import { Box } from "@chakra-ui/layout";
import { Link } from "react-router-dom";
import useManifest from "./useManifest";
import useParam from "./useParam";

function ModelChooser() {
  const manifest = useManifest();
  const modelName = useParam("name");
  const activeStyles = {
    background: "purple.100",
    color: "purple.800",
    boxShadow: "lg",
  };
  const inactiveStyles = {
    _hover: {
      background: "orange.100",
      color: "orange.800",
      boxShadow: "lg",
    },
  };
  return (
    <Box as="nav" p="5" listStyleType="none">
      {Object.entries(manifest || {}).map(([name]) => {
        return (
          <Box
            mb="2"
            key={name}
            as={Link}
            to={`/model?name=${name}`}
            display="block"
            px={3}
            py={2}
            borderRadius="xl"
            {...(modelName === name ? activeStyles : inactiveStyles)}
          >
            {name}
          </Box>
        );
      })}
    </Box>
  );
}

export default ModelChooser;
