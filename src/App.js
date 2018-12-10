import React, { Component } from "react";
import "./App.css";

import DetectedForms from "./DetectedForms";

class App extends Component {
  constructor() {
    super();
    this.state = { forms: [] };
  }

  componentWillMount() {
    function handleMsg(event) {
      var msg = event.data;
      if (msg) {
        switch (msg.action) {
          case "FORMS_DATA":
            this.setState({ forms: msg.payload });
            break;
          default:
            break;
        }
      } else {
        console.warn("Empty event received");
      }
    }
    window.addEventListener("message", handleMsg.bind(this), false);
  }

  render() {
    return (
      <div className="App">
        <main className="App-body">
          <DetectedForms forms={this.state.forms} />
        </main>
      </div>
    );
  }
}

export default App;
