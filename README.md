# lode 🛣
LOD Pipeline for the web.

## What is lode?

lode provides an easy way to use level-of-detail artifacts in web applications.
level-of-details is a technique to render simplified models when the viewer has a bigger distance.
Usually these artifacts are generated by the designer or the developer ahead of time and then integrated into the scene manually.
lode generates different levels for a given `glTF` file and permits to use these levels within a given application.

### CLI

lode has a CLI to generate these artifacts. This is the starting point, see [cli](./cli/README.md) for more information.
### UI

In order to tune the levels, lode provides a UI to see the different artifacts in detail. See [lode-ui](./lode-ui/README.md) for more information.

## Dev

This repo contains different sub projects which have a uniform way of using them.

### Node.js projects

Run `yarn setup` in the root project (this folder) to setup all projects at once.

#### Prerequisites
- yarn ~1.x
- node > v16

#### Dev

Set them all up locally with `yarn setup` inside the root project or individually by running that same command inside the project you want to setup.

The default script to start a project is `yarn start`, if something other applies it's written in the specific project.

#### Code Style

In order to get a coherent code style [Prettier](https://prettier.io/) is used.

### Report

The report is written in LaTeX. Only the raw `.tex` files and resources are being tracked by git.
The pdf output is built and deployed to a specific branch automatically using a Github Action.
Have a look at [report](https://github.com/kreativwebdesign/lode/blob/report/report.pdf) to see the current report built as a pdf.