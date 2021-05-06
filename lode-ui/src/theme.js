import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      "html, body, #root": {
        width: "100%",
        height: "100%",
        padding: 0,
      },
    },
  },
});
export default theme;
