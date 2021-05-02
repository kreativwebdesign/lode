import { Box, Flex } from "@chakra-ui/layout";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";

function LodLevelDisplay({ lod }) {
  const [currentLevel, setCurrentLevel] = useState(0);
  useFrame(() => {
    const level = lod.getCurrentLevel();
    setCurrentLevel(level);
  });
  return (
    <Flex
      as={Html}
      fullscreen
      justify="flex-end"
      align="flex-end"
      direction="column"
      pointerEvents="none"
    >
      <Box bg="rgba(255, 255, 255, 0.5)" p={5} flexGrow="0">
        Current level: {currentLevel}
      </Box>
    </Flex>
  );
}

export default LodLevelDisplay;
