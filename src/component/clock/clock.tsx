import React, { Component } from 'react';

type State = {
  date: Date
};

function FormatDate(props: { date: { toLocaleTimeString: () => React.ReactNode }; })  {
  return <h2>{props.date.toLocaleTimeString()}.</h2>
};

class Clock extends Component<{}, State> {
  constructor(props:any) {
    super(props);
    this.timerID = 0;
    this.state = {
      date: new Date()
    };
  };

  timerID: number;

  componentDidMount():void {
    this.timerID = window.setInterval(() => this.tick(), 1000);
  };

  componentWillUnmount():void {
    clearInterval(this.timerID)
  };

  tick = () => {
    this.setState({
      date: new Date()
    });
  };

  render() {
    return (
      <div>
        <FormatDate date={this.state.date} />
      </div>
    );
  }
};

export default Clock;