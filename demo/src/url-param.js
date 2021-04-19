const URL_PARAM_NAME = "optimized";
const url = new URL(window.location);
const searchParams = url.searchParams;

export const getOptimized = () => searchParams.get(URL_PARAM_NAME);

export const setOptimized = (value) => {
  if (value) {
    searchParams.set(URL_PARAM_NAME, true);
  } else {
    searchParams.delete(URL_PARAM_NAME);
  }
  url.search = searchParams.toString();
  location.href = url.toString();
};
