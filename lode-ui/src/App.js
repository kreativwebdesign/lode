import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider, GlobalStyle, Grid, GridItem } from "@chakra-ui/react";
import ModelChooser from "./ModelChooser";
import ModelViewer from "./ModelViewer";
import theme from "./theme";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Grid h="100%" templateColumns="200px 1fr" templateRows="1fr">
          <GridItem borderWidth={1} rowSpan={2}>
            <ModelChooser />
          </GridItem>
          <GridItem>
            <ModelViewer />
          </GridItem>
        </Grid>
      </Router>
    </ChakraProvider>
  );
}

export default App;
