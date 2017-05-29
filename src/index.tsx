import React from 'react'
import ReactDOM from 'react-dom'

import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Snackbar, Paper } from 'material-ui';
import { Atgism } from './components/Atgism';
import { Navigation, NavigationProps } from './components/Navigation';
const { Grid, Row, Col } = require('react-flexbox-grid');
import { checkQueryParams, getAuth } from './services/auth';
import { NavBar } from './components/NavBar';
import { Auth } from './models/models';

// Needed for onTouchTap - material-UI
// http://stackoverflow.com/a/34015469/988941 
injectTapEventPlugin();

type AppState = {
  activeItem: string,
  alert: {
    open: boolean,
    message: string,
    autoHideDuration?: number,
    actionText?: string
  },
  auth?: Auth,
}

const NAV_ITEMS = {
  ATGISM: 'ATGism',
  DRESS_CODE: 'Dress Code'
}

export interface NavigationProps {
  header: string,
  items: string[],
  activeItem: string,
  itemChanged: (newItem: string) => void,
}

export class App extends React.Component<{}, AppState> {

  state: AppState;
  navigationItems = [NAV_ITEMS.ATGISM, NAV_ITEMS.DRESS_CODE];
  paperStyle = {
    padding: '20px',
  }

  constructor() {
      super();
      this.state = {
        activeItem: NAV_ITEMS.ATGISM,
        alert: {
          open: false,
          message: null,
          autoHideDuration: 4000
        }
      };
      this.onNavChange = this.onNavChange.bind(this);
      this.createAlert = this.createAlert.bind(this);
      this.onAlertClose = this.onAlertClose.bind(this);
  }

  componentDidMount() {
    if(checkQueryParams()) {
      this.createAlert('Login successful');
    }
    this.setState({auth: getAuth()});
  }

  onNavChange(newItem: string) {
    console.log('onNavChange()', newItem);
    this.setState({activeItem: newItem});
  }

  createAlert(message: string, actionText: string = "OK") {
    this.setState({alert: {open: true, message: message, autoHideDuration: 4000, actionText}});
  }

  onAlertClose() {
    this.setState({alert: {open: false, message: null}});
  }

  public render() {
    console.log('Card component', this);
    return (
      <MuiThemeProvider>
        <div>
          {this.state.alert.open && <Snackbar open={this.state.alert.open} message={this.state.alert.message} action="Ok" onActionTouchTap={this.onAlertClose}></Snackbar>}
          <div style={{width: '256px'}}>
            <Navigation
              header='Navigation'
              items={this.navigationItems}
              activeItem={this.state.activeItem}
              itemChanged={this.onNavChange}
              auth={this.state.auth}
            ></Navigation>
          </div>
          <div style={{marginLeft: '256px'}}>
            <NavBar auth={this.state.auth}/>
            <Paper style={this.paperStyle} zDepth={2} >
              {
                this.state.activeItem === NAV_ITEMS.ATGISM ?
                  <Atgism auth={this.state.auth}></Atgism>  :
                  <div>Coming Soon</div>
              }
            </Paper>

          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));