import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';


import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LinearProgress from '@material-ui/core/LinearProgress';

import LinkIcon from '@material-ui/icons/Link'
import HowToVoteIcon from '@material-ui/icons/HowToVote'

const rp = require('request-promise-native');

const styles = theme => ({
  root: {
    flexGrow: 1,
  }
});

const ElectList = (props) => {
    console.log(JSON.stringify(props));
    const listItems = props.elections.map((elem) =>
        <li key={elem.id}><Link to={`elections/${elem.id}`}>{elem.name}</Link></li>
    );
    return <ul>
       {listItems}
    </ul>
}

const InitialItem = ({value, idx, click}) => <ListItem button onClick ={click}><ListItemText primary={value} /></ListItem>


const InitialList = ({elections, handleClick}) => {
  return (
    <List>
      {elections.map((value, index) => (
        <ListItem key={index} button onClick ={() => handleClick(index.id)}><ListItemText primary={value.name} /></ListItem>
      ))}
    </List>
  );
};

class ElectionItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      linkActive:false
    }
  }

  flipActive() {

    let {linkActive} = this.state;
    this.setState({linkActive:!linkActive})
  }

  turnOff() {
    this.setState({linkActive:false})
  }


  render() {
    let {id,name} = this.props;
    let {host} = window.location;

    let field = <ClickAwayListener onClickAway={this.turnOff.bind(this)}><TextField
          id="standard-read-only-input"
          defaultValue={`${host}/vote/${id}`}
          style={{width:225}}
          InputProps={{
            readOnly: true,
            shrink:true
          }}
          inputRef={input => {if(input) {input.focus(); input.select()}}}
        /></ClickAwayListener>
    

    return <ListItem button divider component={Link} to={`elections/${id}`}>
    <ListItemText primary={name} />
    <ListItemSecondaryAction>
    {this.state.linkActive && field}
    
      <IconButton color='primary' aria-label="Vote Link" onClick={this.flipActive.bind(this)}>
        <LinkIcon />
      </IconButton>
      <IconButton color='primary' aria-label="Vote" component={Link} to={`vote/${id}`}>
        <HowToVoteIcon />
      </IconButton>
      
      
    </ListItemSecondaryAction>
  </ListItem>
  }
}

class ElectionsPage extends React.Component{ 
    constructor(props) {
      super(props)
      this.state = {data:undefined,needFetchData:true}
      //if(this.props.authData) this.updateData()
      
    }
  
    componentDidUpdate() {
      if(this.props.authData && this.props.authData.getSignInUserSession && this.state.needFetchData) this.updateData()
    }
    updateData() {
      this.setState({needFetchData:false})
      console.log("GettingData")
      //var token = this.props.authData.getSession()
      var options = {
        uri: 'https://pvyeeoatp7.execute-api.us-east-1.amazonaws.com/Alpha/elections',
        headers: {
            'User-Agent': 'Request-Promise',
            'auth':this.props.authData.getSignInUserSession().accessToken.jwtToken
        },
        json: true // Automatically parses the JSON string in the response
      };
      rp(options)
      .then(data => {
        this.setState({data:data})
        console.log("GotData")
      }).catch(err =>{
        console.log(err)
      })
      
      
    }
    handleClick(id) {
      this.props.history.push(`elections/${id}`)
    }
    render(){
      
      const { classes,authData } = this.props;
      if(!(authData && authData.getSignInUserSession)) return <></>
      if(!this.state.data) return <><LinearProgress style={{margin:100}}/></>;

      
      const {elections} = this.state.data
      const list = <List>{ elections.map((item, index) =>
        <ElectionItem style={{padding:25}} key={index} {...item}/>
      )}
      </List> 
      return <div className={classes.root}>
            <Typography variant="h2" gutterBottom>Your Elections</Typography>
        
            {this.state.data && list}
            <Button color='primary' component={Link} to={`/add-election`}>
            Create New
            </Button>
        </div>;
    }
  }


export default withStyles(styles)(ElectionsPage);