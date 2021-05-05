import { atom } from "recoil";

const artifactChanges = atom({
  key: "artifactChanges",
  default: { changes: [], timestamp: 0 },
});

export default artifactChanges;
