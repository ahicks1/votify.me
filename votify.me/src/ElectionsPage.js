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
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function timeSince(timeStamp) {
  var now = new Date(),
  secondsPast = (now.getTime() - timeStamp) / 1000;
  if(secondsPast <= 60){
    return `${parseInt(secondsPast)} Seconds ago`;
  }
  if(secondsPast <= 3600){
    return `${parseInt(secondsPast/60)} Minutes ago`;
  }
  if(secondsPast <= 86400){
    return `${parseInt(secondsPast/3600)} Hours ago`;
  }
  if(secondsPast > 86400){
    let t = new Date(timeStamp)
    let day = t.getDate();
    let month = monthNames[t.getMonth()]//toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
    let year = t.getFullYear() === now.getFullYear() ? "" :  " "+t.getFullYear();
    return `${month} ${day} ${year}`;
  }
}



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
    let {id,name,time} = this.props;
    let {host} = window.location;

    let field = <ClickAwayListener onClickAway={this.turnOff.bind(this)}><TextField
          id="standard-read-only-input"
          defaultValue={`${host}/vote/${id}`}
          style={{width:225}}
          InputProps={{
            readOnly: true,
            shrink:'true'
          }}
          inputRef={input => {if(input) {input.focus(); input.select()}}}
        /></ClickAwayListener>
    

    return <ListItem button divider component={Link} to={`/elections/${id}`}>
    <ListItemText primary={name} secondary={timeSince(time)} />
    <ListItemSecondaryAction>
    {this.state.linkActive && field}
    
      <IconButton color='primary' aria-label="Vote Link" onClick={this.flipActive.bind(this)}>
        <LinkIcon />
      </IconButton>
      <IconButton color='primary' aria-label="Vote" component={Link} to={`/vote/${id}`}>
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
        data.elections.sort((a,b) => b.time-a.time)
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

            <Button color='primary' component={Link} to={`/add-election`}>
            Create New
            </Button>
            {this.state.data && list}
            
        </div>;
    }
  }


export default withStyles(styles)(ElectionsPage);