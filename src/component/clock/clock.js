import React, { Component } from 'react';

function FormatDate(props)  {
  return <h2>Now is {props.date.toLocaleTimeString()}.</h2>
};

class Clock extends Component {

  state = {
    date: new Date()
  };

  componentDidMount() {
    this.timerId = setInterval(() => this.tick(), 1000)
  };

  componentWillUnmount() {
    clearInterval(this.timerId)
  };

  tick = () => {
    this.setState({
      date: new Date()
    });
  };

  render() {
    return (
      <div>
        <h1>Hello, everyone!!!</h1>
        <FormatDate date={this.state.date} />
      </div>
    );
  }
};

export default Clock