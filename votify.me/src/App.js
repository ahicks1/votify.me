import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Amplify from 'aws-amplify';
import { withAuthenticator, Authenticator } from 'aws-amplify-react';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ElectionsPage from './ElectionsPage'
import ResultsPage from './ResultsPage'
import AddElectionPage from './AddElectionPage'
import VotePage from './VotePage'

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

class App extends React.Component {
  render() {
    return <Router>
      <div>
        <Header />
  
        <Route exact path="/" component={Home} />
        <Route path="/elections" component={ElectionsNav} />
        <Route path="/add-election" component={AddElectionAuth} />
        <Route path="/vote" component={VoteNav} />
      </div>
    </Router>
  };
} 

class Home extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {code:""}

  }
  
  render(){
    return <div><h2>Home</h2>
    <TextField label="Election Name:" onChange={e => this.setState({code:e.target.value})} value={this.state.code}/>
    <div><Button component={Link} to={`/vote/${this.state.code}`}>
      Link
    </Button></div>
    </div>;
  } 
}

const AddElectionAuth = (props) => {
  return <Authenticator>
    <AddElectionPage {...props}/>
  </Authenticator>;
}

const ElectionsAuth = (props) => {
  return <Authenticator>
    <ElectionsPage {...props}/>
  </Authenticator>;
}

const ResultsAuth = (props) => {
  return <Authenticator>
    <ResultsPage {...props}/>
  </Authenticator>;
}


const VoteNav = (props) => {
  return <div>
    
    <Route path={`${props.match.path}/:id`} render= {(p) => <VotePage {...p}/>} />
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

const Header = () => (
  <ul>
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <Link to="/elections">Your Elections</Link>
    </li>
    <li>
      <Link to="/add-election">Create New Election</Link>
    </li>
  </ul>
);

export default App;
