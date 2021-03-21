const chalk = require("chalk");

const info = (...args) => console.log(chalk.white(...args));
const warn = (...args) => console.log(chalk.yellow(...args));
const error = (...args) => console.log(chalk.red(...args));

module.exports = {
  info,
  warn,
  error,
};
