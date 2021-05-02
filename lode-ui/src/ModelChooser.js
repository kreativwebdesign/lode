import { Link } from "react-router-dom";
import useManifest from "./useManifest";

function ModelChooser() {
  const manifest = useManifest();
  return (
    <ul>
      {Object.entries(manifest || {}).map(([name]) => {
        return (
          <li key={name}>
            <Link to={`/model?name=${name}`}>{name}</Link>
          </li>
        );
      })}
    </ul>
  );
}

export default ModelChooser;
