import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

const rp = require('request-promise-native')

const ChoiceList = (props) => {
    console.log(JSON.stringify(props));
    const listItems = props.elections.map((elem) =>
        <li key={elem.id}><Link to={`elections/${elem.id}`}>{elem.name}</Link></li>
    );
    return <ul>
       {listItems}
    </ul>
}

class AddElectionPage extends React.Component{ 
    constructor(props) {
      super(props)
      this.state = {name:"",fields:["derp"]}
      //if(this.props.authData) this.updateData()
      this.updateField = this.updateField.bind(this)
    }
  
    componentDidUpdate() {
      //if(this.props.authData && this.state.needFetchData) this.updateData()
    }
    addElection() {
      var options = {
        method:'POST',
        uri: 'https://pvyeeoatp7.execute-api.us-east-1.amazonaws.com/Alpha/elections',
        headers: {
            'User-Agent': 'Request-Promise',
            'auth':this.props.authData.getSignInUserSession().accessToken.jwtToken
        },
        body: {
          name:this.state.name,
          candidates:this.state.fields
        },
        json: true // Automatically parses the JSON string in the response
      };
      rp(options)
      .then(data => {
        this.setState({data:data})
        console.log(data)
      }).catch(err =>{
        console.log(err)
      })
    }
    addField() {
      let fields = this.state.fields
      fields.push("")
      this.setState({fields:fields})
    }
    removeField(i) {
      this.state.fields.splice(i,1)
      this.setState({fields:this.state.fields})
    }
    updateField(i,e) {
      this.state.fields[i] = e.target.value
      this.setState({fields:this.state.fields})
    }
    changeName(e) {
      this.setState({name:e.target.value})
    }
    
    render(){
      var fieldsComps  = this.state.fields.map((f,i) => {
        return <ListItem key={i} divider>
          <TextField 
            id={`input${i}`}
            label={`Option ${i}`} 
            value={`${f}`}
            onChange={e => this.updateField(i,e)}
              />
          <IconButton onClick={e => this.removeField(i)} aria-label="Add" >
        <DeleteIcon />
        </IconButton>
        
      </ListItem>
      })
      
      return <div>
        <h2>Create New Election</h2>
        <div>
          <TextField label="Election Name:" onChange={e => this.changeName(e)} value={this.state.name}/>
        {this.state.data && <div> </div>}</div>
        <List component="nav">
        <Divider />
        {fieldsComps}
        </List>
        <IconButton onClick={e => this.addField()} aria-label="Add" color="primary">
        <AddIcon />
        </IconButton>
        <Button onClick={e => this.addElection()} color="primary" >Create Election</Button>
        </div>;
    }
  }


export default AddElectionPage;