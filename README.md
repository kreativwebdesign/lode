# lode
LOD Pipeline for the web

## Sub Projects

This repo contains different sub projects which have a uniform way of using them.

### Report

The report is written in LaTeX. Only the raw `.tex` files and resources are being tracked by git.
The pdf output is built and deployed to a specific branch automatically using a Github Action.
Have a look at [report](https://github.com/kreativwebdesign/lode/blob/report/report.pdf) to see the current report built as a pdf.

### Node.js

Yarn is generally used as package manager. Therefore, do a `yarn install` to install packages.

The default script to start a project is `yarn start`, if something other applied it's written in the specific project.

#### Code Style

In order to get a coherent code style [Prettier](https://prettier.io/) is used.
