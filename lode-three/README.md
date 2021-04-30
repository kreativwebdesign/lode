# LODE Three
This helper module helps you to load lode-generated LOD artifacts in a Three.js application.

## Usage

Import the module and pass it your lode-config:

```
import lodLoader from 'lode-three'
import yourLodeConfig from './lode-cli.config.json'

lodLoader.init(yourLodeConfig)
```

and then load your artifacts:

```
lodLoader.load({ basePath: './lode-build/your-files', artifactName: 'artifactName' })
```

### load
This method accepts the basePath of your generated artifacts where all your artifacts are and the specific artifact name.
```
{
  basePath: './lode-build/your-files', // basePath of your generated artifacts,
  artifactName: 'duck' // name of your artifact
}
```
This would work for the following folder structure:
```
|-index.js // where the code is
|-lode-build
  |-your-files
    |-duck
      |-duck-lod-0
      | |-duck.gltf
      | |-duck.bin
      |-duck-lod-1
      | |-duck.gltf
      | |-duck.bin

```