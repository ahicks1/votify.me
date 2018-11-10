import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
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

class ElectionsPage extends React.Component{ 
    constructor(props) {
      super(props)
      this.state = {name:"",fields:[]}
      //if(this.props.authData) this.updateData()
      
    }
  
    componentDidUpdate() {
      //if(this.props.authData && this.state.needFetchData) this.updateData()
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
    render(){
  
      
      return <div>
        <h2>Create New Election</h2>
        <div>
        {this.state.data && <div> </div>}</div>
        </div>;
    }
  }


export default ElectionsPage;