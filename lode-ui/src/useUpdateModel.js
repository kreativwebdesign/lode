import { useRecoilState } from "recoil";
import useBasePath from "./useBasePath";
import manifestState from "./state/manifest";

function useUpdateModel() {
  const basePath = useBasePath();
  const [, setManifest] = useRecoilState(manifestState);

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
  }
  return updateModel;
}

export default useUpdateModel;
