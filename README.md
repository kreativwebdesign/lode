# lode 🛣
LOD Pipeline for the web.

## What is lode?

lode provides an easy way to use level-of-detail artifacts in web applications.
level-of-details is a technique to render simplified models when the viewer has a bigger distance to a certain object.
Usually these artifacts are generated by the designer or the developer ahead of time and then integrated into the scene manually.
lode generates different levels for a given `glTF` file and permits to use these levels within a given application.

## Sub Projects

This repo contains different sub projects which have a uniform way of using them.\
Set them all up locally with `yarn setup` inside the root project or individually by running that same command inside the project you want to setup.

### Report

The report is written in LaTeX. Only the raw `.tex` files and resources are being tracked by git.
The pdf output is built and deployed to a specific branch automatically using a Github Action.
Have a look at [report](https://github.com/kreativwebdesign/lode/blob/report/report.pdf) to see the current report built as a pdf.

### Node.js

Yarn is generally used as package manager. Therefore, do a `yarn install` to install packages.

The default script to start a project is `yarn start`, if something other applied it's written in the specific project.

#### Code Style

In order to get a coherent code style [Prettier](https://prettier.io/) is used.
