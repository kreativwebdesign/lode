import { useEffect } from "react";
import { useRecoilState } from "recoil";
import useBasePath from "./useBasePath";
import manifestState from "./state/manifest";

function useManifest() {
  const basePath = useBasePath();
  const [manifest, setManifest] = useRecoilState(manifestState);
  useEffect(() => {
    fetch(`${basePath}/manifest`)
      .then((res) => res.json())
      .then((json) => {
        setManifest(json);
      });
  }, [basePath, setManifest]);
  return manifest;
}

export default useManifest;
