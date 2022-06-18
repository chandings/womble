import {useState, useEffect, useRef} from 'react'
import ToggleButton from '../toggleButton/ToggleButton'

import "./Config.scss";

export default function Config() {
  const [useDragInput,setUseDragInput] = useState(true);
  const dragTB = useRef();
  const [audio,setAudio] = useState(true);
  const audioTB = useRef();
  useEffect(()=>{
    let wombleConfigStr = localStorage.getItem('wombleConfigData');
    let wombleConfigData
    if(!wombleConfigStr || wombleConfigStr===""){
      wombleConfigData = {
        useDragInput:false,
        audio:true
      }
    }else{
      wombleConfigData = JSON.parse(wombleConfigStr);
    }
    console.log(wombleConfigData);
    setUseDragInput(wombleConfigData.useDragInput);
    dragTB.current.setValue(wombleConfigStr.useDragInput);
    setAudio(wombleConfigData.audio);
    audioTB.current.setValue(wombleConfigStr.audio);
  },[])

  useEffect(()=>{
    const wombleConfigData = {useDragInput,audio}

    localStorage.setItem('wombleConfigData',JSON.stringify(wombleConfigData));
    
  },[useDragInput,audio]);
  return (
    <div className='config-container'>
        <div className='config'>
        <h3>Config</h3>
        <label>Choose your game input method.</label>
        <ToggleButton
          ref={dragTB}
          prefix="Drag Input"
          suffix="Button Input"
          change={(value)=>{setUseDragInput(value)}}
          initialValue={useDragInput}
        />
        <hr/>
        <label>Audio</label>
        <ToggleButton
          ref={audioTB}
          prefix="Audio On"
          suffix="Audio Off"
          change={(value)=>{setUseDragInput(value)}}
          initialValue={audio}
        />
        </div>
    </div>
  )
}
