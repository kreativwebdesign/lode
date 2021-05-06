import { useRecoilState } from "recoil";
import useBasePath from "./useBasePath";
import manifestState from "./state/manifest";
import artifactChangesState from "./state/artifactChanges";

function useUpdateModel() {
  const basePath = useBasePath();
  const [, setManifest] = useRecoilState(manifestState);
  const [, setArtifactChanges] = useRecoilState(artifactChangesState);

  function updateModel({ name, model }) {
    fetch(`${basePath}/updateModel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, model }),
    })
      .then((res) => res.json())
      .then((json) => {
        setManifest(json);
      });

    fetch(`${basePath}/changes`)
      .then((res) => res.json())
      .then(({ manifest, ...artifactChanges }) => {
        setArtifactChanges(artifactChanges);
        setManifest(manifest);
      });
  }
  return updateModel;
}

export default useUpdateModel;
