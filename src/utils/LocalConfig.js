const getLocalCofigData = ()=>{
    let wombleConfigStr = localStorage.getItem('wombleConfigData');
    let wombleConfigData;
    if(!wombleConfigStr || wombleConfigStr===""){
      wombleConfigData = {
        useDragInput:false,
        audio:true
      }
      localStorage.setItem('wombleConfigData',JSON.stringify(wombleConfigData));
    }else{
      wombleConfigData = JSON.parse(wombleConfigStr);
    }
    return wombleConfigData
}

const setLocalConfigDataParam = (value, param)=>{
    const wombleConfigData = JSON.parse(localStorage.getItem('wombleConfigData'));
    wombleConfigData[param] = value;

    localStorage.setItem('wombleConfigData',JSON.stringify(wombleConfigData));
}

export {setLocalConfigDataParam, getLocalCofigData}