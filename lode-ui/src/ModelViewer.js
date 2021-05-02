import { useLocation } from "react-router";
import Model from "./Model";
import useBasePath from "./useBasePath";
import useManifest from "./useManifest";

function ModelViewer() {
  const basePath = useBasePath();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const name = params.get("name");

  const manifest = useManifest();

  const fileDescription = manifest[name];
  const fileName = name.split("/").pop();

  return (
    <div style={{ display: "flex" }}>
      {(fileDescription?.levels || []).map((_, i) => {
        return (
          <Model
            key={i}
            url={`${basePath}/assets/${name}/lod-${i}/${fileName}.gltf`}
          />
        );
      })}
    </div>
  );
}

export default ModelViewer;
