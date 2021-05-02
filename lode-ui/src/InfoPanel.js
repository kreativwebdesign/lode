import { Box, Flex } from "@chakra-ui/layout";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useState } from "react";

function Infopanel({ object }) {
  const { camera } = useThree();
  const [distance, setDistance] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  useFrame(() => {
    const d = camera.position.distanceTo(object.position);
    setDistance(d.toFixed(2));
    const level = object.getCurrentLevel();
    setCurrentLevel(level);
  });
  return (
    <Flex
      as={Html}
      fullscreen
      justify="space-between"
      align="flex-end"
      direction="row"
      pointerEvents="none"
    >
      <Box bg="rgba(255, 255, 255, 0.5)" p={5}>
        Distance to object: {distance}
      </Box>
      <Box bg="rgba(255, 255, 255, 0.5)" p={5}>
        Current level: {currentLevel}
      </Box>
    </Flex>
  );
}

export default Infopanel;
