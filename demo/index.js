import BABYLON from 'babylonjs'
import 'babylonjs-loaders'
import 'babylonjs-materials'

// Get the canvas DOM element
const canvas = document.getElementById('renderCanvas')
// Load the 3D engine
const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
})
// CreateScene function that creates and return the scene
const createScene = function () {
  // Create a basic BJS Scene object
  const scene = new BABYLON.Scene(engine)
  // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
  const camera = new BABYLON.FreeCamera(
    'camera1',
    new BABYLON.Vector3(0, 5, -10),
    scene
  )
  // Target the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero())
  // Attach the camera to the canvas
  camera.attachControl(canvas, false)

  // define custom nodes based on flag
  const useOptimized = window.location.search.includes('optimize')
  console.log('optimized: ' + useOptimized)

  performance.mark('gltfLoadStart')
  BABYLON.SceneLoader.Append(
    'assets/Shoe/',
    `Shoe-${useOptimized ? 'LOD1' : 'LOD0'}.gltf`,
    scene,
    function (scene) {
      performance.mark('gltfLoadEnd')
      // Create a default arc rotate camera and light.
      scene.createDefaultCameraOrLight(true, true, true)
      performance.measure('modelLoading', 'gltfLoadStart', 'gltfLoadEnd')
    }
  )

  scene.debugLayer.show()

  // Return the created scene
  return scene
}
// call the createScene function
const scene = createScene()
// run the render loop
engine.runRenderLoop(function () {
  performance.mark('renderLoopStart')
  scene.render()
  performance.mark('renderLoopEnd')
  console.log('::benchmark::fps::' + engine.getFps().toFixed())
  performance.measure('renderLoop', 'renderLoopStart', 'renderLoopEnd')
})
// the canvas/window resize event handler
window.addEventListener('resize', function () {
  engine.resize()
})
