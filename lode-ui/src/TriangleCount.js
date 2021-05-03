import { Box, Flex } from "@chakra-ui/react";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";

function TriangleCount({ url }) {
  const { gl } = useThree();
  const [triangleCount, setTriangleCount] = useState(0);
  const triangles = gl.info.render.triangles;

  // gl.info.render.triangles is a ref, therefore it cannot be used in effect, 500ms is sufficient for 99 percentile, whatever the reasonin
  useEffect(() => {
    setTriangleCount(0);
    setTimeout(() => {
      setTriangleCount(gl.info.render.triangles);
    }, 500);
    // eslint-disable-next-line
  }, [triangles, url]);

  if (triangleCount === 0) {
    return null;
  }
  return (
    <Flex
      as={Html}
      fullscreen
      justify="flex-start"
      direction="column"
      pointerEvents="none"
    >
      <Box bg="rgba(255, 255, 255, 0.5)" p={2}>
        Triangle count: {triangleCount}
      </Box>
    </Flex>
  );
}

export default TriangleCount;
