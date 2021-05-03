import React from "react";
import { Box, Flex } from "@chakra-ui/layout";

function Infopanel({ distanceToObject, currentLodLevel }) {
  return (
    <Flex
      justify="space-between"
      align="flex-end"
      direction="row"
      pointerEvents="none"
    >
      <Box bg="rgba(255, 255, 255, 0.5)" p={5}>
        Distance to object: {distanceToObject}
      </Box>
      <Box bg="rgba(255, 255, 255, 0.5)" p={5}>
        Current level: {currentLodLevel}
      </Box>
    </Flex>
  );
}

export default Infopanel;
