import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, withRouter, Redirect } from 'react-router-dom';
import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator, Authenticator } from 'aws-amplify-react';
import './App.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';


import ElectionsPage from './ElectionsPage'
import ResultsPage from './ResultsPage'
import AddElectionPage from './AddElectionPage'
import VotePage from './VotePage'
import ThanksPage from './ThanksPage'



Amplify.configure({
  Auth: {
      // REQUIRED - Amazon Cognito Region
      region: 'us-east-1', 
      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: 'us-east-1_fJtNPqIhN',
      // OPTIONAL - Amazon Cognito Web Client ID
      userPoolWebClientId: '7rrkppdo26u3r1b1dgfugq0vdf', 
      // Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
      authenticationFlowType: 'USER_SRP_AUTH'
  }
});

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#8e24aa',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: '#78909c',
    },
    error: {
      main:'#bf360c'
    }
    // error: will use the default color
  },
});


class App extends React.Component {

  render() {
    return <MuiThemeProvider theme={theme}><Router>
      <div>
        <AuthHeader />
  
        <Route exact path="/" component={Home} />
        <Route path="/elections" component={ElectionsNav} />
        <Route path="/thanks" component={ThanksPageGrid} />
        <Route path="/add-election" component={AddElectionAuth} />
        <Route path="/vote" component={VoteNav} />
        <Route path="/sign-in" component={SignInAuth} />
      </div>
    </Router>
    </MuiThemeProvider>
  };
} 

function withGrid(WrappedComponent) {
    return <div style={{flexGrow:1}}>
    <Grid container spacing={16} justify="center">
      <Grid item xs={12} md={8}>
      {WrappedComponent}
      </Grid>
      </Grid>
      </div>
}



class Home extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {code:""}

  }
  
  render(){
    return withGrid(<>
    <Typography variant="h2" gutterBottom>Welcome to Votify.me</Typography>
    <TextField label="Election Name:" onChange={e => this.setState({code:e.target.value})} value={this.state.code}/>
    <br/>
    <Button component={Link} to={`/vote/${this.state.code}`}>
      Link
    </Button>
    </>);
  } 
}

const ThanksPageGrid = (props) => {
  return withGrid(<ThanksPage {...props} />)
}
const SignInPage = (props) => {
  return <div>{props.authData && <div> <Redirect to='/elections'/> </div>}</div>
}
const SignInAuth = (props) => {
  return <Authenticator>
    <SignInPage {...props}/>
  </Authenticator>;
}

const AddElectionAuth = (props) => {
  return withGrid(<Authenticator>
    <AddElectionPage {...props}/>
  </Authenticator>);
}

const ElectionsAuth = (props) => {
  return withGrid(<Authenticator>
    <ElectionsPage {...props}/>
  </Authenticator>);
}

const ResultsAuth = (props) => {
  return withGrid(<Authenticator>
    <ResultsPage {...props}/>
  </Authenticator>);
}


const VoteNav = (props) => {
  return <div>
    
    <Route path={`${props.match.path}/:id`} render= {(p) => 
    
        withGrid(<VotePage {...p}/>)} />
    <Route
      exact
      path={props.match.path}
      render={() => <ElectionsAuth {...props}/>}
    />
    </div>;
}


const ElectionsNav = (props) => {
  return <div>
    
    <Route path={`${props.match.path}/:id`} render= {(p) => <ResultsAuth {...p}/>} />
    <Route
      exact
      path={props.match.path}
      render={() => <ElectionsAuth {...props}/>}
    />
    </div>;
}


class Topic extends React.Component{ 
  constructor(props) {
    super(props);
    this.state = {msg:'hello',props:props}
    console.log(JSON.stringify(props))
  }
  render() {return <h3>Requested Param: {this.props.match.params.id}</h3>;}
};
const linkStyle = {
  color: 'inherit',
  textDecoration: 'inherit'
};

class Header extends React.Component {
  state = {
    auth: true,
    anchorEl: null,
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
    Auth.currentAuthenticatedUser()
    .then(user => this.setState({auth:true}))
    .catch(err => this.setState({auth:false}));
  };

  handleClose = (loc) => {
    this.setState({ anchorEl: null });
    if(loc) this.props.history.push(loc);
  };

  handleSignOut = () => {
    Auth.signOut()
    this.props.history.push('/')
    this.setState({ anchorEl: null });
  }

    
    render() {
      const { anchorEl } = this.state;
      const open = Boolean(anchorEl);
      let auth = false
     
      return <AppBar elevation="0" color="inherit" position="static" style={{flexGrow:1,width:'100%'}}>
          <Toolbar>
            
            <Link color='inerit' to="/" style={{textDecoration: 'none',flexGrow:1}}><Typography variant="h6" color='secondary' >Votify.me</Typography></Link>

            
                <div>
                  <IconButton
                    aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    color='secondary'
                    onClick={this.handleMenu}
                  >
                    <AccountCircle />
                  </IconButton>
                  {this.state.auth && (<Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={open}
                    onClose={this.handleClose}
                  >
                  
                    
                    <MenuItem onClick={this.handleClose} component={Link} to='/elections'>Your Elections</MenuItem>
                    <MenuItem onClick={this.handleClose} component={Link} to='/add-election'>Create New Election</MenuItem>
                    <MenuItem onClick={this.handleSignOut}>Sign Out</MenuItem>
                    
                    )
                  </Menu>)}
                  {!this.state.auth && (<Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={open}
                    onClose={this.handleClose}
                  >
                    <MenuItem onClick={() => this.handleClose('/sign-in')}>Sign In</MenuItem>
                    
                    )
                  </Menu>)}
                </div>
              
          </Toolbar>
        </AppBar>
      }

    }
    const AuthHeader = withRouter(Header);

export default App;
