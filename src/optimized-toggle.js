import { getOptimized, setOptimized } from "./url-param.js";

const $checkbox = document.querySelector("[data-toggle-is-optimized]");
$checkbox.checked = getOptimized();

$checkbox.addEventListener("click", (e) => {
  setOptimized(e.target.checked);
});
