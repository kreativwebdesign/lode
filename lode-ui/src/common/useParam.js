import { useLocation } from "react-router";

export default function useParam(name) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  return params.get(name);
}
