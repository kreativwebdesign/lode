import chalk from "chalk";

export const info = (...args) => console.log(chalk.white(...args));
export const success = (...args) => console.log(chalk.green(...args));
export const warn = (...args) => console.log(chalk.yellow(...args));
export const error = (...args) => console.log(chalk.red(...args));
