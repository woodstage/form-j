import React, { Component } from 'react';
import Button from './Button';
import './App.css';

const Key = ({k}) => (<label className="form-key">{k}</label>)
const Value = ({v}) => (<span className="form-value">{v}</span>)

const DetectedForm = ({ name, form }) => (
  <ul className="detected-form">
    <h2>{name}</h2> 
    {Object.keys(form).map(i => {
      return <li key={i}><Key k={i}/><Value v={form[i]}/></li>
    })}
  </ul>
)

const DetectedForms = ({ forms }) => {
  return Object.keys(forms).map(key => {
    return <DetectedForm key={key} name={key} form={forms[key]}/>
  })
}

class App extends Component {

  constructor() {
    super();
    this.state = {forms: {}};
  }

  componentWillMount() {
    function handleMsg(event) {
      var msg = event.data;
      if (msg) {
        switch(msg.action) {
          case 'ADD_FORM': this.setState({forms: {...this.state.forms, [msg.payload.id]: msg.payload.formdata} });break;
          default: break;
        }
      } else {
        console.warn('Empty event received');
      }
    }
    window.addEventListener('message', handleMsg.bind(this), false);
  }
  
  handleDetect() {
    window.parent.postMessage({action: 'DETECT_FORMS_REQ'}, '*');
    console.debug('send DETECT_FORMS_REQ');
  }

  handleList() {

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Button type="round" onClick={this.handleDetect.bind(this)}>Detect</Button>
        </header>
        <main className="App-body">
          <DetectedForms forms={this.state.forms}/>
        </main>
      </div>
    );
  }
}

export default App;
