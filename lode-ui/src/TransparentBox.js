import { Box } from "@chakra-ui/layout";

function TransparentBox(props) {
  return <Box bg="rgba(255, 255, 255, 0.5)" p={2} {...props} />;
}

export default TransparentBox;
