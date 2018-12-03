import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { ResponsiveBar } from '@nivo/bar'

import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import IconButton from '@material-ui/core/IconButton'

import RefreshIcon from '@material-ui/icons/Refresh'
import SaveIcon from '@material-ui/icons/SaveAlt'
import HowToVoteIcon from '@material-ui/icons/HowToVote'

const rp = require('request-promise-native')

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

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
        colors="#8e24aa"
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
        labelTextColor="white"
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
      if(this.props.authData && this.props.authData.getSignInUserSession && this.state.needFetchData) this.updateData()
    }
    async updateData() {
      this.setState({needFetchData:false})
      console.log("GettingData")
      //var token = this.props.authData.getSession()
      var resOptions = {
        uri: `https://pvyeeoatp7.execute-api.us-east-1.amazonaws.com/Alpha/${this.props.match.params.id}/results`,
        headers: {
            'User-Agent': 'Request-Promise',
            'auth':this.props.authData.getSignInUserSession().accessToken.jwtToken
        },
        json: true // Automatically parses the JSON string in the response
      };

      var infoOptions = {
        uri: `https://pvyeeoatp7.execute-api.us-east-1.amazonaws.com/Alpha/${this.props.match.params.id}`,
        headers: {
            'User-Agent': 'Request-Promise',
            'auth':this.props.authData.getSignInUserSession().accessToken.jwtToken
        },
        json: true // Automatically parses the JSON string in the response
      };

      let resPromise = rp(resOptions)
      let infoPromise = rp(infoOptions)
      try {
      let res = await resPromise
      let info = await infoPromise
      res.results.sort((a,b) => a.votes - b.votes)
      this.setState({data:res,info:info})
      console.log("GotData")
      
      }catch(err) {
        console.log(err)
      }
      
      
      
    }

    downloadData() {
      let {info,data} = this.state;
      let csvData = "Name, Votes\n" + data.results.map(r => `"${r.name}", ${r.votes}`).join("\n")
      let blob = new Blob([csvData], {type: 'text/csv'});
      if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, info.name);
      }
      else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = info.name;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
      }

    }
    render(){

      let {info,data} = this.state

      

      if(!data) {
        return <>
          <Typography variant="h2" gutterBottom>Loading {this.props.match.params.id}</Typography>
          <LinearProgress />
        </>
      }

      let t = new Date(info.time)
      let day = t.getDate();
      let month = monthNames[t.getMonth()]//toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
      let year = t.getFullYear();
      
  
      
      return <div>
        <Typography variant="h2" gutterBottom>Election: {info.name}
          <IconButton color='secondary'  onClick={this.updateData.bind(this)}>
            <RefreshIcon />
          </IconButton>
          </Typography> 
          
        <Typography variant="subtitle1" gutterBottom >
        <IconButton color='primary' aria-label="Vote" component={Link} to={`/vote/${this.props.match.params.id}`}>
        <HowToVoteIcon />
        </IconButton>
        <IconButton color='primary' aria-label="Vote Link" onClick={this.downloadData.bind(this)}>
        <SaveIcon />
      </IconButton>Created: {month} {day}, {year} </Typography>
        <Typography variant="h6" gutterBottom>{data['vote-count']} Votes</Typography>
        
        
        {data && <Plot data={data.results} keys={data.results.map(e => e.name)}/>}
        </div>;
    }
  }


export default ResultsPage;