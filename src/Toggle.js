import React from "react";
import Switch from "./Switch"

export default class Toggle extends React.Component {
  state = { on: false }
  toggle = () => {
    this.props.onToggle(!this.state.on);
    this.setState({ on: !this.state.on });
  }
  render() {
    const { on } = this.state
    return (
      <Switch on={on} label='C' onClick={this.toggle} />
    )
  }
}
