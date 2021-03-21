const chalk = require("chalk");

const info = (...args) => console.log(chalk.white(...args));
const success = (...args) => console.log(chalk.green(...args));
const warn = (...args) => console.log(chalk.yellow(...args));
const error = (...args) => console.log(chalk.red(...args));

module.exports = {
  info,
  success,
  warn,
  error,
};
