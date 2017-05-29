import React from 'react';
import { AppBar, FlatButton, RaisedButton, ListItem, Avatar } from 'material-ui';
import { Auth } from '../models/models';
import { getUserPhoto } from '../services/dataservice';

type NavBarProps = {
  auth?: Auth
}

type NavBarState = {
  userPhoto?: string
}

export class NavBar extends React.Component<NavBarProps, NavBarState> {

  constructor(props) {
    super(props);
    this.state = {}
    // get user photo

  }

  public componentDidMount() {
    console.info('NavBar componentDidMount()', this.props);
  }

  public componentWillReceiveProps(nextProps: NavBarProps) {
    if(nextProps.auth && (!this.props.auth || this.props.auth.access_token !== nextProps.auth.access_token)) {
      this.getUserPhoto(nextProps.auth);
    }
  }

  private getUserPhoto(auth: Auth) {
    getUserPhoto(auth)
    .then(data => {
      console.log('user photo', data);
      if(data && data.image) {
        this.setState({userPhoto: `data:image/png;base64, ${data.image}`})
      } else {
        console.log('could not set user photo, no data returned');
      }
    })
    .catch(err => {
      console.log('could not get user photo', err);
    });
  }

  styles = {
    button: {
      marginTop: '5px',
    }
  }

  loginUrl = `/auth/login/?finalURL=${window.location.protocol}//${window.location.host}/`;

  public render() {

    const rightlement = this.props.auth ?
      (<ListItem
        rightAvatar={
          this.state.userPhoto ? 
            <Avatar src={this.state.userPhoto}></Avatar> :
            <Avatar>{this.props.auth.initials}</Avatar>
        }
        disabled={true}>
      </ListItem>) :
      (<RaisedButton
              href={this.loginUrl}
              style={this.styles.button}
              secondary={true}
              label="Login Using Office 365" />);

    return (
      <AppBar
          title={<span>ATGisms</span>}
          showMenuIconButton={false}
          iconElementRight={rightlement}
        />
    );
  }
}