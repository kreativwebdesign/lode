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
  // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
  const light = new BABYLON.HemisphericLight(
    'light1',
    new BABYLON.Vector3(0, 1, 0),
    scene
  )

  // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
  const ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene, false)

  // define custom nodes based on flag
  const useOptimized = window.location.search.includes('optimize')
  console.log('optimized: ' + useOptimized)
  for (let i = 0; i < 60; i++) {
    let knot
    if (useOptimized) {
      knot = BABYLON.Mesh.CreateTorusKnot('knot1', 0.5, 0.2, 16, 8, 2, 3, scene)
    } else {
      knot = BABYLON.Mesh.CreateTorusKnot(
        'knot2',
        0.5,
        0.2,
        2056,
        64,
        2,
        3,
        scene
      )
    }
    knot.position.x = -3 + i * 0.1
  }

  scene.debugLayer.show()

  // Return the created scene
  return scene
}
// call the createScene function
const scene = createScene()
// run the render loop
engine.runRenderLoop(function () {
  scene.render()
  console.log('::benchmark::fps::', engine.getFps().toFixed())
})
// the canvas/window resize event handler
window.addEventListener('resize', function () {
  engine.resize()
})
