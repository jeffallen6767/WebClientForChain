import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
import {
  Fingerprint,
  LockOpen,
  Lock,
  ContentCopy,
  Store,
  InfoOutline,
  Warning,
  DateRange,
  LocalOffer,
  Update,
  ArrowUpward,
  AccessTime,
  Accessibility
} from "material-ui-icons";

import { withStyles, Grid } from "material-ui";

import {
  StatsCard,
  ChartCard,
  TasksCard,
  RegularCard,
  Table,
  ItemGrid
} from "components";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts";

import dashboardStyle from "variables/styles/dashboardStyle";

function fit(chars, max, fill="...") {
  const 
    cLen = chars.length,
    fLen = fill.length,
    mLen = Math.min(cLen-fLen, max-fLen),
    odd = mLen % 2,
    half = (odd ? mLen - 1 : mLen) / 2,
    first = chars.slice(0, odd ? half + 1 : half),
    last = chars.slice((-1)*half);
  return first + fill + last;
}

class Dashboard extends React.Component {
  constructor () {
    super();
    //console.log("Dashboard.constructor", [].slice.call(arguments));
    this.lock = this.lock.bind(this);
  }
  
  state = {
    value: 0
  };
  
  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  
  lock = (event, all, api, account) => {
    console.log("+ lock", account, api, event);
    api.lockAccount(account, (err, data) => {
      console.log("api.lockAccount callback", err, data);
      if (err) {
        console.error("api.lockAccount, error:", err);
        return;
      } else {
        if (data.account.keys && data.account.keys.locked) {
          console.log("api.lockAccount, success:");
          console.log(data.account);
          all.appState.accounts[data.account.data.index] = data.account;
          all.updateAppState({
            account: {name:''},
            accounts: all.appState.accounts
          });
          
        } else {
          this.setState({
            "warning": "Invalid passphrase!"
          });
        }
      }
    });
    //this.setState({ showCreateModal: true, createModalData: {"name":"","pass":""} });
  }
  
  render() {
    console.log("Dashboard.render.props", this.props);
    
    const { classes, all, api, ...rest } = this.props;
    console.log("classes", classes);
    console.log("all", all);
    console.log("api", api);
    console.log("rest", rest);
    
    const appState = all.appState;
    console.log("appState", appState);
    
    const account = appState.account;
    console.log("account", account);
    
    const lockAccount = (event) => {
      this.lock(event, all, api, account);
    };
    
    return (
      <div>
        <Grid container>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={Fingerprint}
              iconColor="blue"
              title={"Identity"}
              description={account.name}
              small={fit(account.keys.publicKey, 16)}
              statIcon={LockOpen}
              statIconColor="danger"
              statLink={{ text: "Click to LOCK...", func: lockAccount }}
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={Store}
              iconColor="green"
              title="Revenue"
              description="$34,245"
              statIcon={DateRange}
              statText="Last 24 Hours"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={InfoOutline}
              iconColor="red"
              title="Fixed Issues"
              description="75"
              statIcon={LocalOffer}
              statText="Tracked from Github"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={Accessibility}
              iconColor="blue"
              title="Followers"
              description="+245"
              statIcon={Update}
              statText="Just Updated"
            />
          </ItemGrid>
        </Grid>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={4}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart"
                  data={dailySalesChart.data}
                  type="Line"
                  options={dailySalesChart.options}
                  listener={dailySalesChart.animation}
                />
              }
              chartColor="green"
              title="Daily Sales"
              text={
                <span>
                  <span className={classes.successText}>
                    <ArrowUpward
                      className={classes.upArrowCardCategory}
                    />{" "}
                    55%
                  </span>{" "}
                  increase in today sales.
                </span>
              }
              statIcon={AccessTime}
              statText="updated 4 minutes ago"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={4}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart"
                  data={emailsSubscriptionChart.data}
                  type="Bar"
                  options={emailsSubscriptionChart.options}
                  responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                  listener={emailsSubscriptionChart.animation}
                />
              }
              chartColor="orange"
              title="Email Subscriptions"
              text="Last Campaign Performance"
              statIcon={AccessTime}
              statText="campaign sent 2 days ago"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={4}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart"
                  data={completedTasksChart.data}
                  type="Line"
                  options={completedTasksChart.options}
                  listener={completedTasksChart.animation}
                />
              }
              chartColor="red"
              title="Completed Tasks"
              text="Last Campaign Performance"
              statIcon={AccessTime}
              statText="campaign sent 2 days ago"
            />
          </ItemGrid>
        </Grid>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={6}>
            <TasksCard />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={6}>
            <RegularCard
              headerColor="orange"
              cardTitle="Employees Stats"
              cardSubtitle="New employees on 15th September, 2016"
              content={
                <Table
                  tableHeaderColor="warning"
                  tableHead={["ID", "Name", "Salary", "Country"]}
                  tableData={[
                    ["1", "Dakota Rice", "$36,738", "Niger"],
                    ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                    ["3", "Sage Rodriguez", "$56,142", "Netherlands"],
                    ["4", "Philip Chaney", "$38,735", "Korea, South"]
                  ]}
                />
              }
            />
          </ItemGrid>
        </Grid>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
