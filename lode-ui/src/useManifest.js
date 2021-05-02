import { useEffect, useState } from "react";
import useBasePath from "./useBasePath";

function useManifest() {
  const basePath = useBasePath();
  const [manifest, setManifest] = useState({});
  useEffect(() => {
    fetch(`${basePath}/manifest`)
      .then((res) => res.json())
      .then((json) => {
        setManifest(json);
      });
  }, [basePath]);
  return manifest;
}

export default useManifest;
