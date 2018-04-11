import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { withStyles, Grid } from "material-ui";

import { 
  Header, 
  Footer, 
  Sidebar,
  ItemGrid,
  RegularCard,
  Table
} from "components";

import appRoutes from "routes/app.jsx";

import appStyle from "variables/styles/appStyle.jsx";

import image from "assets/img/sidebar-2.jpg";
import logo from "assets/img/cash-money-inverted.png";

import { api } from "api";

const switchRoutes = (
  <Switch>
    {appRoutes.map((prop, key) => {
      if (prop.redirect)
        return <Redirect from={prop.path} to={prop.to} key={key} />;
      return <Route path={prop.path} component={prop.component} key={key} api={api} />;
    })}
  </Switch>
);

class App extends React.Component {
  state = {
    accounts: [],
    account: {
      name: ''
    },
    mobileOpen: false
  };
  getAccountKeys = () => {
    return [
      "ID", 
      "Name", 
      "Balance", 
      "Status", 
      "Public Key"
    ];
  };
  getAccountData = () => {
    return this.state.accounts.map((account, idx) => {
      return [
        idx + "", 
        account.name, 
        "$ " + (account.balance || 0).toFixed(2) + "", 
        typeof account.keys.privateKey === "string" ? "Unlocked" : "Locked",
        account.keys.public
      ];
    });
  };
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  getRoute() {
    return this.props.location.pathname !== "/maps";
  }
  componentDidMount() {
    if(navigator.platform.indexOf('Win') > -1){
      // eslint-disable-next-line
      const ps = new PerfectScrollbar(this.refs.mainPanel);
    }
    api.get.accounts((err, data) => {
      console.log("callback", [].slice.call(arguments));
      if (err) {
        console.error("App.jsx, componentDidMount, api.get.accounts, error:", err);
        return;
      } else {
        console.log("App.jsx, componentDidMount, api.get.accounts, success:", data, data.accounts);
        this.setState({ accounts: data.accounts });
      }
    });
  }
  componentDidUpdate() {
    this.refs.mainPanel.scrollTop = 0;
  }
  render() {
    const { classes, ...rest } = this.props;
    return this.state.account.name !== '' ? (
      <div className={classes.wrapper}>
        <Sidebar
          routes={appRoutes}
          logoText={"Web Chain"}
          logo={logo}
          image={image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color="blue"
          {...rest}
        />
        <div className={classes.mainPanel} ref="mainPanel">
          <Header
            routes={appRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />
          {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          {this.getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>{switchRoutes}</div>
            </div>
          ) : (
            <div className={classes.map}>{switchRoutes}</div>
          )}
          {this.getRoute() ? <Footer /> : null}
        </div>
      </div>
    ) : (
      <div className={classes.wrapper} ref="mainPanel">
        <Grid container>
          
          <ItemGrid xs={12} sm={12} md={6}>
            <RegularCard
              headerColor="blue"
              cardTitle="Chain Accounts"
              cardSubtitle="Please choose an account."
              content={
                <Table
                  tableHeaderColor="info"
                  tableHead={this.getAccountKeys()}
                  tableData={this.getAccountData()}
                />
              }
            />
          </ItemGrid>
        </Grid>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(appStyle)(App);
