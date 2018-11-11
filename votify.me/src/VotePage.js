import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
const rp = require('request-promise-native')



class VotePage extends React.Component{ 
    constructor(props) {
      super(props)
      this.state = {data:undefined,needFetchData:true}
      //this.updateData()
      
    }
    componentDidMount() {
      if(this.state.needFetchData) this.updateData()
    }
    componentDidUpdate() {
      if(this.state.needFetchData) this.updateData()
    }
    updateData() {
      this.setState({needFetchData:false})
      console.log("GettingData")
      //var token = this.props.authData.getSession()
      var options = {
        uri: `https://pvyeeoatp7.execute-api.us-east-1.amazonaws.com/Alpha/${this.props.match.params.id}`,
        headers: {
            'User-Agent': 'Request-Promise'
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
        <h2>Vote on {this.props.match.params.id}</h2>
        <div>
        {this.state.data && <div> Hello </div>}</div>
        </div>;
    }
  }


export default VotePage;