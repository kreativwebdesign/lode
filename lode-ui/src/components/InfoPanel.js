import React from "react";
import { Flex } from "@chakra-ui/layout";
import TransparentBox from "./visual/TransparentBox";

function Infopanel({ distanceToObject, currentLodLevel }) {
  return (
    <Flex
      justify="space-between"
      align="flex-end"
      direction="row"
      pointerEvents="none"
    >
      <TransparentBox>Distance to object: {distanceToObject}</TransparentBox>
      <TransparentBox>Current level: {currentLodLevel}</TransparentBox>
    </Flex>
  );
}

export default Infopanel;
