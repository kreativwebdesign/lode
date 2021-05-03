import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider, Grid, GridItem } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import ModelChooser from "./ModelChooser";
import ModelViewer from "./ModelViewer";
import theme from "./theme";

function App() {
  return (
    <RecoilRoot>
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
    </RecoilRoot>
  );
}

export default App;