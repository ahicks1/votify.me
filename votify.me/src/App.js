import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Link, 
  withRouter, 
  Redirect } from 'react-router-dom';
import Amplify, { Auth } from 'aws-amplify';
import { Authenticator } from 'aws-amplify-react';
import { 
  ConfirmSignIn, 
  ConfirmSignUp, 
  ForgotPassword, 
  RequireNewPassword, 
  SignIn, 
  VerifyContact } from 'aws-amplify-react';

//material-ui imports
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

//Local imports
import ElectionsPage from './ElectionsPage'
import ResultsPage from './ResultsPage'
import AddElectionPage from './AddElectionPage'
import VotePage from './VotePage'
import ThanksPage from './ThanksPage'
import SignUp from './CustomSignup'


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

const ampTheme = {
  sectionHeader: {},
  button: { 'backgroundColor': '#8e24aa' },
  a: {'color':'#8e24aa'}
}

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

/**
 * Hods the whole app including the router
 */
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

/**
 * Used to layout grid for pages
 * @param {React.Component} WrappedComponent 
 */
function withGrid(WrappedComponent) {
    return <div style={{flexGrow:1}}>
    <Grid container justify="center">
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
    let {code} = this.state;

    return withGrid(<>
     <Grid container justify="center">
      <Grid item ><img item alt="logo" width='200' src={require('./LogoSVG.svg')}></img></Grid></Grid>
      <Typography align='center' variant="h2" gutterBottom>Welcome to Votify.me</Typography>
      <Typography align='center' variant="h5" gutterBottom>Make simple <a rel="noopener noreferrer" target="_blank" href="https://en.wikipedia.org/wiki/Borda_count">Borda count</a> polls</Typography>
      <Grid container justify="center">
      <Grid item >
      <Button component={Link} to={`/add-election`}>
        Get started
    </Button>
    </Grid>
    </Grid>
    </>);
  } 
}

const ThanksPageGrid = (props) => withGrid(<ThanksPage {...props} />)

const SignInPage = ({authData}) => <>
  {authData && <> <Redirect to='/elections'/> </>}
</>


const SignInAuth = (props) => {
  return <Authenticator hideDefault={true} theme={ampTheme}>
    <SignIn/>
    <SignUp/>
    <ConfirmSignIn/>
    <VerifyContact/>
    <ConfirmSignUp/>
    <ForgotPassword/>
    <RequireNewPassword />
    <SignInPage {...props}/>
  </Authenticator>;
}

const AddElectionAuth = (props) => {
  return withGrid(<Authenticator  hideDefault={true}  theme={ampTheme}>
    <SignIn/>
    <SignUp/>
    <ConfirmSignIn/>
    <VerifyContact/>
    <ConfirmSignUp/>
    <ForgotPassword/>
    <RequireNewPassword />
    <AddElectionPage {...props}/>
  </Authenticator>);
}

const ElectionsAuth = (props) => {
  return withGrid(<Authenticator  hideDefault={true} theme={ampTheme}>
    <SignIn/>
    <SignUp/>
    <ConfirmSignIn/>
    <VerifyContact/>
    <ConfirmSignUp/>
    <ForgotPassword/>
    <RequireNewPassword />
    <ElectionsPage {...props}/>
  </Authenticator>);
}

const ResultsAuth = (props) => {
  return withGrid(<Authenticator  hideDefault={true} theme={ampTheme}>
    <SignIn/>
    <SignUp/>
    <ConfirmSignIn/>
    <VerifyContact/>
    <ConfirmSignUp/>
    <ForgotPassword/>
    <RequireNewPassword />
    <ResultsPage {...props}/>
  </Authenticator>);
}


const VoteNav = (props) => {
  return <>
    <Route 
      path={`${props.match.path}/:id`} 
      render={(p) => withGrid(<VotePage {...p} />)} 
    />
    <Route
      exact
      path={props.match.path}
      render={() => <ElectionsAuth {...props} />}
    />
  </>;
}


const ElectionsNav = (props) => {
  return <>
    <Route 
      path={`${props.match.path}/:id`} 
      render= {(p) => <ResultsAuth {...p}/>} 
    />
    <Route
      exact
      path={props.match.path}
      render={() => <ElectionsAuth {...props}/>}
    />
    </>;
}

/**
 * Component that shows navigation and login information on all pages
 */
class Header extends React.Component {
  state = {
    auth: true,
    anchorEl: null,
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
    //TODO: Use Hub to handle auth events
    Auth.currentAuthenticatedUser()
    .then(user => this.setState({auth:true}))
    .catch(err => this.setState({auth:false}));
  };

  handleClose = (loc) => {
    this.setState({ anchorEl: null });
  };

  handleSignOut = () => {
    Auth.signOut()
    this.setState({ anchorEl: null });
    this.props.history.push('/')
    
  }

    
    render() {
      const { anchorEl,auth } = this.state;
      const open = Boolean(anchorEl);

      return <AppBar 
        elevation="0" 
        color="inherit" 
        position="static" 
        style={{flexGrow:1,width:'100%'}}>
          <Toolbar>
            
            <Link 
              color='inerit' 
              to="/" style={{textDecoration: 'none',flexGrow:1}}
            >
              <Typography variant="h6" color='secondary' >Votify.me</Typography>
            </Link>
        <div>
          <IconButton
            aria-owns={open ? 'menu-appbar' : undefined}
            aria-haspopup="true"
            color='secondary'
            onClick={this.handleMenu}
          >
            <AccountCircle />
          </IconButton>
          {auth && (<Menu
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
            onClose={this.handleClose}>


            <MenuItem 
              onClick={this.handleClose} 
              component={Link} to='/elections'>
            Your Elections</MenuItem>

            <MenuItem 
              onClick={this.handleClose} 
              component={Link} to='/add-election'
            >
              Create New Election</MenuItem>
            <MenuItem 
              onClick={this.handleSignOut}
            >
              Sign Out
            </MenuItem>)
          </Menu>)}

            {!auth && (<Menu
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
              <MenuItem 
                onClick = {this.handleClose}
                component = {Link} 
                to='/sign-in'
              >Sign In</MenuItem>

            )
                  </Menu>)}
        </div>

      </Toolbar>
    </AppBar>
  }

    }
    const AuthHeader = withRouter(Header);

export default App;
