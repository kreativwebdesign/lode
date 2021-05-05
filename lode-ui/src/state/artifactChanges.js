import { atom } from "recoil";

const artifactChanges = atom({
  key: "artifactChanges",
  default: { change: null, timestamp: 0 },
});

export default artifactChanges;
