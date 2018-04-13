// ##############################
// // // App styles
// #############################

import { drawerWidth, transition, container } from "variables/styles.jsx";

const appStyle = theme => ({
  root: {
    flexGrow: 1,
  },
  demo: {
    /*width: 240,*/
  },
  accounts: {
    margin: "auto",
  },
  wrapper: {
    position: "relative",
    top: "0",
    height: "100vh"
  },
  mainPanel: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`
    },
    overflow: "auto",
    position: "relative",
    float: "right",
    ...transition,
    maxHeight: "100%",
    width: "100%",
    overflowScrolling: 'touch'
  },
  content: {
    marginTop: "70px",
    padding: "30px 15px",
    minHeight: "calc(100% - 123px)"
  },
  container,
  map: {
    marginTop: "70px"
  }
});

export default appStyle;
