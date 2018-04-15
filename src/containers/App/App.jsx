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
  Table,
  UnlockModal
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
  
  constructor () {
    super();
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }
  
  defaultAccount = {
    name: '',
    //name: 'test',
  };
  
  state = {
    accounts: [],
    account: this.defaultAccount,
    mobileOpen: false,
    showModal: false,
    modalData: {}
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
    api.getAccounts((err, data) => {
      //console.log("callback", [].slice.call(arguments));
      if (err) {
        console.error("App.jsx, componentDidMount, api.get.accounts, error:", err);
        return;
      } else {
        if (data.error) {
          console.error("App.jsx, componentDidMount, api.get.accounts, error:", data.error, data);
        } else if (!Array.isArray(data.accounts)) {
          console.error("App.jsx, componentDidMount, api.get.accounts, error: data.accounts not array", data);
        } else {
          //console.log("App.jsx, componentDidMount, api.get.accounts, success:", data, data.accounts);
          this.setState({ accounts: data.accounts });
        }
      }
    });
  }
  
  componentDidUpdate() {
    this.refs.mainPanel.scrollTop = 0;
  }

  handleOpenModal = (event, key, prop) => {
    console.log("+ handleOpenModal", key, prop, event);
    this.setState({ showModal: true, modalData: this.state.accounts[key] });
  }
  
  handleCloseModal = (event, unlockedAccount) => {
    console.log("- handleCloseModal", unlockedAccount, event);
    this.setState({ showModal: false, account: unlockedAccount || this.defaultAccount});
  }
  
  /*
  <p>Modal text!</p>
          <button onClick={this.handleCloseModal}>Close Modal</button>
  */
  render() {
    const { classes, ...rest } = this.props;
    
    const alignItems = 'center';
    const direction = 'row';
    const justify = 'center';
    
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
        <UnlockModal 
           isOpen={this.state.showModal}
           closeModal={this.handleCloseModal}
           modalData={this.state.modalData}
           contentLabel="onRequestClose Example"
           onRequestClose={this.handleCloseModal}
           shouldCloseOnOverlayClick={false}
        >
          
        </UnlockModal>
        <Grid container className={classes.root}>
          <ItemGrid xs={12} sm={1} md={12}>
            <Grid
              container
              spacing={16}
              className={classes.demo}
              alignItems={alignItems}
              direction={direction}
              justify={justify}
            >
              <Grid key="accounts" item className={classes.accounts}>
                <RegularCard
                  headerColor="blue"
                  cardTitle="Chain Accounts"
                  cardSubtitle="Please choose an account."
                  content={
                    <Table
                      tableHeaderColor="info"
                      tableHead={this.getAccountKeys()}
                      tableData={this.getAccountData()}
                      onClick={this.handleOpenModal}
                    />
                  }
                />
              </Grid>
            </Grid>
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
