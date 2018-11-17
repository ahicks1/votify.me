import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText'
import LinearProgress from '@material-ui/core/LinearProgress';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';

import DragIcon from '@material-ui/icons/DragIndicator';

const rp = require('request-promise-native')

function ordinal_suffix_of(i) {
  var j = i % 10,
      k = i % 100;
  if (j == 1 && k != 11) {
      return i + "st";
  }
  if (j == 2 && k != 12) {
      return i + "nd";
  }
  if (j == 3 && k != 13) {
      return i + "rd";
  }
  return i + "th";
}

const SortableItem = SortableElement(({value, idx}) =>
  <Paper style={{marginTop:15}}><ListItem ><DragIcon></DragIcon><ListItemText primary={value} /></ListItem></Paper>
);

const SortableList = SortableContainer(({items}) => {
  return (
    <List style={{maxHeight: '50vh', overflow: 'scroll'}}>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} idx={index} value={<div>{value}</div>}/ >
      ))}
    </List>
  );
});

const InitialItem = ({value, idx, click}) => <Paper style={{marginTop:15}}><ListItem button onClick ={click}><ListItemText primary={value} /></ListItem></Paper>


const InitialList = ({items, handleClick}) => {
  return (
    <List style={{maxHeight: '50vh', overflow: 'scroll'}}>
      {items.map((value, index) => (
        <InitialItem key={`item-${index}`} index={index} idx={index} click={() => handleClick(index)}value={<div>{value}</div>}/ >
      ))}
    </List>
  );
};

class SelectComponent extends Component {
  render() {
    return <InitialList handleClick={this.props.handleClick} items={this.props.items} onSortEnd={this.props.onSortEnd} />;
  }
}

const FinalList = ({items}) => {
  return (
    <div>
      {items.map((value, index) => (
        <Typography style={{marginTop:15}} variant="subheading" key={`item-${index}`} >#{index+1} - {value}</Typography>
      ))}
    </div>
  );
};

class SortableComponent extends Component {
  render() {
    return <SortableList pressDelay={100} items={this.props.items} onSortEnd={this.props.onSortEnd} />;
  }
}

function getSteps() {
  return ['Select Choices', 'Re-order Candidates', 'Verify'];
}
class VotePage extends React.Component{ 
    constructor(props) {
      super(props)
      this.state = {
        data:undefined,
        needFetchData:true,
        voting:false,
        candidates:[],
        vote:[],
        activeStep: 0
      }
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
        this.setState({data:data,candidates:data.candidates})
        console.log("GotData")
      }).catch(err =>{
        console.log(err)
      })
      
      
    }

    updateCandidates({oldIndex, newIndex}) {
        console.log("Called callback")
        this.setState({
          vote: arrayMove(this.state.vote, oldIndex, newIndex),
        });
      
    }
    

    handleNext = () => {
      const { activeStep } = this.state;
      this.setState({
        activeStep: activeStep + 1,
      });
    };

    handleBack = () => {
      this.setState(state => ({
        activeStep: state.activeStep - 1,
      }));
    };

    selectOption(idx) {
      console.log("removing "+idx)
      let {candidates,vote} = this.state;
      let selection = candidates[idx];
      candidates.splice(idx,1);
      vote.push(selection)
      this.setState({vote:vote,candidates:candidates})
      if(candidates.length === 0) this.handleNext();
    }

    vote() {
      var options = {
        method:'POST',
        uri: `https://pvyeeoatp7.execute-api.us-east-1.amazonaws.com/Alpha/${this.props.match.params.id}/vote`,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        body: {
          items:this.state.vote
        },
        json: true // Automatically parses the JSON string in the response
      };
      rp(options)
      .then(data => {
        console.log(data)
        this.setState({voting:false})
        this.props.history.push('/thanks')
      }).catch(err =>{
        console.log(err)
      })
      this.setState({voting:true});
      this.handleNext();
    }
    render(){

      const steps = getSteps();
      const { activeStep } = this.state;
      if(!this.state.data) {
        return <div >
          <h2>Loading {this.props.match.params.id}</h2>
          <LinearProgress />
        </div>
      }

      if(this.state.voting) {
        return <div >
          <h2>Voting for {this.state.data.name}</h2>
          <LinearProgress />
        </div>
      }

 
      
      
      return <div>
        <h2>Vote on {this.state.data.name}</h2>
        <div>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const props = {};
            const labelProps = {};
            return (
              <Step key={label} {...props}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        
        {this.state.activeStep === 0 && <div>
          <Typography variant="subheading">Make your {ordinal_suffix_of(this.state.vote.length+1)} place choice:</Typography>
          <SelectComponent handleClick={this.selectOption.bind(this)}items={this.state.candidates}/>
          </div>
        }
        {this.state.activeStep === 1 && <div> 
          <Typography variant="subheading">Adjust your vote?</Typography>
          <SortableComponent onSortEnd={this.updateCandidates.bind(this)} items={this.state.vote}/> <Button onClick={this.handleNext} color="primary" >Continue</Button>
          </div>
        }
        {this.state.activeStep === 2 && <div> 
          Is this how you want to vote? 
          <FinalList items={this.state.vote}></FinalList><Button onClick={this.handleBack}  >Back</Button><Button onClick={e => this.vote()} color="primary" >Vote</Button>
          </div>
        }
         </div>
        </div>;
    }
  }


export default VotePage;