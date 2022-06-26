import {useState, useEffect, useRef} from 'react'
import ToggleButton from '../toggleButton/ToggleButton'
import "./Config.scss";
import * as faIcons from "react-icons/fa";
import {setLocalConfigDataParam, getLocalCofigData} from "../../utils/LocalConfig"

export default function Config({setCurrentView}) {
  const [useDragInput,setUseDragInput] = useState();
  const dragTB = useRef();
  const [audio,setAudio] = useState();
  const audioTB = useRef();
  useEffect(()=>{
    let wombleConfigData = getLocalCofigData();
    console.log(wombleConfigData);
    setUseDragInput(wombleConfigData.useDragInput);
    dragTB.current.setValue(wombleConfigData.useDragInput);
    setAudio(wombleConfigData.audio);
    audioTB.current.setValue(wombleConfigData.audio);
  },[])

  const saveWombleConfigData = (value, param)=>{
    setLocalConfigDataParam(value, param);
  }


  return (
    <div className='config-container'>
      <div className='config'>
        <div className="config-close-btn-container">
          <button className="close-btn" onClick={()=>{setCurrentView("")}}>
            <faIcons.FaTimes/>
          </button>
        </div>
        <h3>Config</h3>
        <label>Choose your game input method.</label>
        <ToggleButton
          ref={dragTB}
          prefix="Drag Input"
          suffix="Button Input"
          change={(value)=>{saveWombleConfigData(value,"useDragInput");setUseDragInput(value)}}
          initialValue={useDragInput}
        />
        <hr/>
        <label>Audio</label>
        <ToggleButton
          ref={audioTB}
          prefix="Audio On"
          suffix="Audio Off"
          change={(value)=>{saveWombleConfigData(value,"audio");setAudio(value) }}
          initialValue={audio}
        />
        </div>
    </div>
  )
}
