import { Box, Flex } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import { useEffect, useState } from "react";
import deepEql from "deep-eql";
import { Button } from "@chakra-ui/button";

function ArtifactForm({ level, updateArtifact }) {
  const { distance, ...l } = level;
  const [levelState, setLevel] = useState(l);
  useEffect(() => {
    setLevel(l);
  }, [deepEql(l)]);
  const onThresholdChange = (e) =>
    setLevel((l) => ({ ...l, threshold: parseInt(e.target.value) }));
  const onTargetScaleChange = (e) =>
    setLevel((l) => ({
      ...l,
      configuration: {
        ...l.configuration,
        targetScale: parseFloat(e.target.value),
      },
    }));
  const onSubmit = (e) => {
    e.preventDefault();
    updateArtifact(levelState);
  };
  return (
    <Box as="form" onSubmit={onSubmit}>
      <Flex as="label" align="center">
        <Box flexShrink={0} mr={2}>
          Trigger at distance:
        </Box>
        <Input
          value={levelState.threshold}
          type="number"
          onChange={onThresholdChange}
        />
      </Flex>
      {!!levelState.configuration && (
        <Flex as="label" align="center">
          <Box flexShrink={0} mr={2}>
            Targetscale:
          </Box>
          <Input
            value={levelState.configuration.targetScale}
            type="number"
            onChange={onTargetScaleChange}
            min={0}
            max={1}
            step={0.00001}
          />
        </Flex>
      )}
      <Flex as="label" align="center" justify="space-between">
        (Visible from: {distance - l.threshold}-{distance})
        <Button type="submit">Speichern</Button>
      </Flex>
    </Box>
  );
}

export default ArtifactForm;
