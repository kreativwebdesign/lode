# LODE-CLI

This CLI helps to automatically generate LOD artifacts for `.gltf` files.

## Use Package

The package can be used via `npm install -D @kreativwebdesign/lode-cli`, `yarn add -D @kreativwebdesign/lode-cli` or just `npx @kreativwebdesign/lode-cli`

### init

To setup a configuration file, run `npx @kreativwebdesign/lode-cli init`. This will guide you through the setup for the configuration file. If you change the name of the configuration file, make sure to pass the path to the run command.

#### Configuration file

```lode-cli.config.json
{
  "source": "**/*.gltf",
  "outputFoldername": "lode-build",
  "watch": false
}

```

### config
Run `npx @kreativwebdesign/lode-cli config` to configure the level of details for each model.
You can pass the following options:
| Option           | Description              | Default                  |
| ---------------- | ------------------------ | ------------------------ |
| `-c`, `--config` | Path to config file      | `./lode-cli.config.json` |
| `-s`, `--source` | Source glob pattern      | `**/*.gltf`              |
| `-a`, `--all`    | Wheter to reconfigure all models | `false`          |

\
For each model the following options can be set:\
`How many level of details should i generate (min. 2)`: Set how many level of details the cli should generate for this model. Minimum is two, the first being the original file.\
\
Then for each level of detail the following options can be set:\
`For which distance should the artifact "XXX" be used? (-1 for infinity)`:\
Set the distance, this artifact should be visible. The values stack onto the previous distance. Type `-1` for the last artifact to be rendered infinitely (only valid for the last artifact). The first one being the original artifact\
`Target scale for the artifact "LOD-X" (0-1)`:\
Set the target scale for this artifact relative to the original size. Choose a value between 1 (being the same as the original) and 0 (being no polygons). This can not be set for the original artifact.


### run

This command runs the LOD generating. You can pass various options to this command.
Run `npx @kreativwebdesign/lode-cli` or `npx @kreativwebdesign/lode-cli run` to execute it. You can pass various options to the run command. These flags override the configuration file.

| Option           | Description              | Default                  |
| ---------------- | ------------------------ | ------------------------ |
| `-c`, `--config` | Path to config file      | `./lode-cli.config.json` |
| `-s`, `--source` | Source glob pattern      | `**/*.gltf`              |
| `-o`, `--outputFoldername` | Outputfoldername | `lode-build`           |
| `-w`, `--watch`  | Watch source files and start lode API server on port 3001       | `false`                  |
| `-h`, `--help`   | Display help for command |                          |

### help

Run `npx @kreativwebdesign/lode-cli help` to display help.

### clean

Run `npx @kreativwebdesign/lode-cli clean` to clean the output folder. You can pass the same `outputFoldername` and `config` option as for the `run` command.

## Dev Usage

Instead of installing the package one can simply run `npx @kreativwebdesign/lode-cliyarn start` while working on the cli itself.

## Dev

Run `yarn setup` to get up and running

### Publish

- Prepare versions and ensure clean setup state
- `npm publish --access public`
