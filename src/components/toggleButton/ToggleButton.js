import "./ToggleButton.scss"

import React, { Component } from 'react'

export default class ToggleButton extends Component {

    constructor(props){
        super(props);
        this.state = {
            value:true
        }
    }
    setValue(newValue){
        this.setState({value:newValue})
    }
  render() {
    const {value} = this.state;
    const {prefix, suffix, change} = this.props;
    return (
        <div className='toggle-button-container'>
        <label className={((!value)?'active ':'') + 'toggle-button-prefix'}>{prefix}</label>
        <div className='toggle-button-bg' 
            onClick={()=>{
                this.setState((prevValue)=>{
                    change(!prevValue.value);
                    return {value:!prevValue.value}
                });
            }}>
            <div className={((value)?'active ':'') + 'toggle-button-grip'}></div>
        </div>
        <label className={((value)?'active ':'') + 'toggle-button-suffix'}>{suffix}</label>
    </div>
    )
  }
}
