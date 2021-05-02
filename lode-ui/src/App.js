import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider, Grid, GridItem } from "@chakra-ui/react";
import ModelChooser from "./ModelChooser";
import ModelViewer from "./ModelViewer";
import "./App.css";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Grid h="100%" templateColumns="200px 1fr" templateRows="1fr">
          <GridItem borderWidth={1} rowSpan={2}>
            <ModelChooser></ModelChooser>
          </GridItem>
          <GridItem>
            <ModelViewer></ModelViewer>
          </GridItem>
        </Grid>
      </Router>
    </ChakraProvider>
  );
}

export default App;
