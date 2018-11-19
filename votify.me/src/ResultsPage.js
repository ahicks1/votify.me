import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { ResponsiveBar } from '@nivo/bar'

import Typography from '@material-ui/core/Typography'

const rp = require('request-promise-native')

const pStyle = {}
const Plot = (props) => {
    let charLen = Math.max(...props.data.map(e => e.name.length))
    return <div style={{height:props.data.length * 100}}><ResponsiveBar
        data={props.data}
        keys={["votes"]}
        indexBy="name"
        layout="horizontal"
        margin={{
            "top": 50,
            "right": 130,
            "bottom": 50,
            "left": 10*charLen
        }}
        padding={0.2}
        colors="dark2"
        colorBy="id"
        borderColor="inherit:darker(1.6)"
        axisBottom={{
            "tickSize": 5,
            "tickPadding": 5,
            "tickRotation": 0,
            "legend": "Votes",
            "legendPosition": "middle",
            "legendOffset": 32
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="inherit:darker(1.6)"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
    /></div>
}

class ResultsPage extends React.Component{ 
    constructor(props) {
      super(props)
      this.state = {data:undefined,needFetchData:true}
      if(this.props.authData) this.updateData()
      console.log(JSON.stringify(props))
      
    }
  
    componentDidUpdate() {
      if(this.props.authData && this.state.needFetchData) this.updateData()
    }
    updateData() {
      this.setState({needFetchData:false})
      console.log("GettingData")
      //var token = this.props.authData.getSession()
      var options = {
        uri: `https://pvyeeoatp7.execute-api.us-east-1.amazonaws.com/Alpha/${this.props.match.params.id}/results`,
        headers: {
            'User-Agent': 'Request-Promise',
            'auth':this.props.authData.getSignInUserSession().accessToken.jwtToken
        },
        json: true // Automatically parses the JSON string in the response
      };
      rp(options)
      .then(data => {
        data.results.sort((a,b) => a.votes - b.votes)
        this.setState({data:data})
        console.log("GotData")
      }).catch(err =>{
        console.log(err)
      })
      
      
    }
    render(){
  
      
      return <div>
        <Typography variant="h2" gutterBottom>Election</Typography>
        
        {this.state.data && <Plot data={this.state.data.results} keys={this.state.data.results.map(e => e.name)}/>}
        </div>;
    }
  }


export default ResultsPage;