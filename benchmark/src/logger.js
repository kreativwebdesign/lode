let logDetails = null;

export const setLogDetail = (flag) => {
  if (logDetails !== null) {
    throw new Error("logDetail may only be set once");
  }
  logDetails = flag;
};

export const logDetail = (...args) => {
  if (logDetails === null) {
    throw new Error(
      "logDetail is not initialized, make sure to set flag before calling logger."
    );
  }

  if (logDetails) {
    console.log(...args);
  }
};
