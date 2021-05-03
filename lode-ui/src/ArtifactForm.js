import { Box, Flex } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import { useEffect, useState } from "react";

function ArtifactForm({ level, updateArtifact }) {
  const { distance, ...l } = level;
  const [threshold, setThreshold] = useState(l.threshold);
  useEffect(() => {
    setThreshold(l.threshold);
  }, [l.threshold]);
  const onChange = (e) => setThreshold(parseInt(e.target.value));
  const onSubmit = (e) => {
    e.preventDefault();
    updateArtifact({ ...l, threshold });
  };
  return (
    <Box as="form" onSubmit={onSubmit}>
      <Flex as="label" align="center">
        <Box flexShrink={0} mr={2}>
          Trigger at distance:
        </Box>
        <Input value={threshold} type="number" onChange={onChange} />
      </Flex>
      (Visible from: {distance - l.threshold}-{distance})
    </Box>
  );
}

export default ArtifactForm;
