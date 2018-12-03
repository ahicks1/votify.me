import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

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

const FinalList = ({items}) => {
  return (
    <div>
      {items.map((value, index) => (
        <Typography style={{marginTop:15}} variant="subheading" key={`item-${index}`} >#{index+1} - {value}</Typography>
      ))}
    </div>
  );
};

function getSteps() {
  return ['Select Choices', 'Re-order Candidates', 'Verify'];
}

class AddElectionPage extends React.Component{ 
    constructor(props) {
      super(props)
      this.state = {
        name:"",
        fields:[""],
        activeStep:0,
        authVote: false,
        resPublic: false,
      }
      //if(this.props.authData) this.updateData()
      this.updateField = this.updateField.bind(this)
      
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
    enterHandle(event) {
      if(event.charCode === 13){
        event.preventDefault(); // Ensure it is only this code that runs
        this.addField(event);
      }
    }

    componentDidUpdate() {
      //if(this.props.authData && this.state.needFetchData) this.updateData()
    }
    addElection() {
      this.handleNext();
      var options = {
        method:'POST',
        uri: 'https://pvyeeoatp7.execute-api.us-east-1.amazonaws.com/Alpha/elections',
        headers: {
            'User-Agent': 'Request-Promise',
            'auth':this.props.authData.getSignInUserSession().accessToken.jwtToken
        },
        body: {
          name:this.state.name,
          candidates:this.state.fields.filter(e => e !== ""),
          secure:this.state.authVote
        },
        json: true // Automatically parses the JSON string in the response
      };
      rp(options)
      .then(data => {
        this.setState({data:data})
        console.log(data)
        this.props.history.push(`/elections/${data.id}`)
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
      let {fields} = this.state;
      fields[i] = e.target.value
      this.setState({fields:fields})
    }
    changeName(e) {
      this.setState({name:e.target.value})
    }
    handleChange = name => event => {
      this.setState({ [name]: event.target.checked });
    };
    
    render(){

      if(!(this.props.authData && this.props.authData.getSignInUserSession)) return <div></div>

      var last = this.state.fields.length - 1;
      var fieldsComps  = this.state.fields.map((f,i) => {
        return <ListItem key={i} divider>
          <TextField 
            id={`input${i}`}
            label={`Option ${i+1}`} 
            value={`${f}`}
            onChange={e => this.updateField(i,e)}
            onKeyPress={e => this.enterHandle(e)}
            inputRef={input => input && i===last && input.focus()}
              />
          <IconButton onClick={e => this.removeField(i)} aria-label="Add" >
        <DeleteIcon />
        </IconButton>
        
      </ListItem>
      })
      const steps = getSteps();
      const { activeStep } = this.state;
      return <div>
        <Typography variant="h2" gutterBottom>Create New Election</Typography>
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
          <Typography variant="subheading">Name your votify poll and set options</Typography>
          <TextField label="Election Name:" onChange={e => this.changeName(e)} value={this.state.name}/>
          <br/>
          <FormControlLabel
          control={
            <Switch
              checked={this.state.authVote}
              onChange={this.handleChange('authVote')}
              value="resPublic"
              color="primary"
            />
          }
          label="Require sign-in to vote"
        />
        {/**<FormControlLabel
          control={
            <Switch
              checked={this.state.resPublic}
              onChange={this.handleChange('resPublic')}
              value="resPublic"
              color="primary"
            />
          }
          label="Public viewing of results"
        />*/}
          <Button onClick={this.handleNext} color="primary" >Continue</Button>
          </div>
        }
        {this.state.activeStep === 1 && <div> 
          <Typography variant="subheading">List your options</Typography>
          <List component="nav">
            <Divider />
           {fieldsComps}
          </List>
          <IconButton onClick={e => this.addField()} aria-label="Add" color="primary">
            <AddIcon />
          </IconButton>
          <Button onClick={this.handleBack}  >Back</Button><Button onClick={this.handleNext} color="primary" >Continue</Button>
          </div>
        }
        {this.state.activeStep === 2 && <div> 
          <Typography variant="h4" gutterBottom>Does this look right?</Typography>
          <Typography variant="h5" gutterBottom>{this.state.name}:</Typography>
          <FinalList items={this.state.fields.filter(e => e !== "")}></FinalList>
          <Button onClick={this.handleBack}  >Back</Button><Button onClick={e => this.addElection()} color="primary" >Create Election</Button>
          </div>
        }

        
        {this.state.activeStep === 3 && <div >
          <h2>Creating {this.state.name}</h2>
          <LinearProgress />
        </div>}
      
          
        </div>
        </div>;
    }
  }


export default AddElectionPage;