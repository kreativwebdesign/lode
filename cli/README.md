# LODE-CLI

This CLI helps you to generate LOD artifacts for you gltf files.

## Usage

To run the script inside this repo, use `yarn start`.

### init

To setup a configuration file, run `yarn start init`. This will guide you through the setup for the configuration file. If you change the name of the configuration file, make sure to pass the path to the run command.

#### Configuration file
```lode-cli.config.json
{
  "source": "**/*.gltf",
  "watch": false
}

```

### run

This command runs the LOD generating. You can pass various options to this command.
Run `yarn start` or `yarn start run` to execute it. You can pass various options to the run command. These flags override the configuration file.

| Option | Description | Default |
|---|---|---|
| `-c`, `--config` | Path to config file | `./lode-cli.config.json` |
| `-w`, `--watch` | Watch source files | `false` |
| `-s`, `--source` | Source glob pattern | `**/*.gltf` |
| `-h`, `--help` | Display help for command |   |

### help

Run `yarn start help` to display help.
