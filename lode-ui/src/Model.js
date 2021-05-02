import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";

function Model({ url }) {
  const statsParent = useRef(null);
  return (
    <div ref={statsParent}>
      <Canvas>
        <OrbitControls />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        <Suspense fallback={null}>
          <GltfModel url={url} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function GltfModel({ url }) {
  const { scene } = useGLTF(url);

  return <primitive object={scene} />;
}

export default Model;
