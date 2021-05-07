import { Box, Flex } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import { useEffect, useState } from "react";
import deepEql from "deep-eql";
import { Button } from "@chakra-ui/button";

function InputBox({ children }) {
  return <Box maxWidth="100px">{children}</Box>;
}

function InputGroup({ label, children, ...props }) {
  return (
    <Flex as="label" align="center" justifyContent="space-between" {...props}>
      <Box flexShrink={0} mr={2} minWidth="150px">
        {label}:
      </Box>
      {children}
    </Flex>
  );
}

function ArtifactForm({ level, updateArtifact, startingDistance }) {
  const { distance, ...l } = level;
  const [levelState, setLevel] = useState(l);
  useEffect(() => {
    if (!deepEql(l, levelState)) {
      setLevel(l);
    }
    // only apply effect when the level changes for example bc of a new manifest.
    // adding the levelState to the dep-array would trigger it everytime, the user inputs something
    // eslint-disable-next-line
  }, [level]);
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
      <InputGroup label="Visibility distance">
        <InputBox>
          <Input
            value={levelState.threshold}
            type="number"
            onChange={onThresholdChange}
          />
        </InputBox>
      </InputGroup>
      {!!levelState.configuration && (
        <InputGroup label="Targetscale" mt={2}>
          <InputBox>
            <Input
              value={levelState.configuration.targetScale}
              type="number"
              onChange={onTargetScaleChange}
              min={0}
              max={1}
              step="any"
            />
          </InputBox>
        </InputGroup>
      )}
      <Flex as="label" align="center" justify="space-between" mt={2}>
        (Visible from: {startingDistance}-{distance})
        <Button type="submit">Save</Button>
      </Flex>
    </Box>
  );
}

export default ArtifactForm;
