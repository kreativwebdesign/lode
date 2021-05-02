import { Box, Flex } from "@chakra-ui/layout";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useState } from "react";

function DistanceToObject({ object }) {
  const { camera } = useThree();
  const [distance, setDistance] = useState(0);
  useFrame(() => {
    const d = camera.position.distanceTo(object.position);
    setDistance(d.toFixed(2));
  });
  return (
    <Flex
      as={Html}
      fullscreen
      justify="flex-end"
      direction="column"
      pointerEvents="none"
    >
      <Box bg="rgba(255, 255, 255, 0.5)" p={5}>
        Distance to object: {distance}
      </Box>
    </Flex>
  );
}

export default DistanceToObject;
