// define custom nodes based on flag
const useOptimized = window.location.search.includes("optimize");

export default [
  {
    gltfPath: `assets/Shoe/Shoe-${useOptimized ? "LOD1" : "LOD0"}.gltf`,
    position: [-5, 0, 0],
    scale: [20, 20, 20],
  },
  {
    gltfPath: `assets/Avocado/Avocado-${useOptimized ? "LOD1" : "LOD0"}.gltf`,
    position: [0, -5, 0],
    scale: [20, 20, 20],
  },
  {
    gltfPath: `assets/DamagedHelmet/DamagedHelmet-${
      useOptimized ? "LOD1" : "LOD0"
    }.gltf`,
    position: [5, 0, 0],
    scale: [2, 2, 2],
  },
  {
    gltfPath: `assets/SciFiHelmet/SciFiHelmet-${
      useOptimized ? "LOD1" : "LOD0"
    }.gltf`,
    position: [0, 5, 0],
    scale: [2, 2, 2],
  },
];
