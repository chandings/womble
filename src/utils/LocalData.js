const getWombleData = ()=>{
    const wombleDataStr = localStorage.getItem('wombleData');
    let wombleData;
    if(!wombleDataStr || wombleDataStr === ""){
        wombleData = {
            score:0, 
            level:0, 
            unlockNextLevel:false,
            allPlayerWords:[]
          };
        localStorage.setItem('wombleData',JSON.stringify(wombleData));
    }else{
        wombleData = JSON.parse(wombleDataStr);
    }
    return wombleData;
}

const setWombleDataParam = (value, param)=>{
    const wombleData = getWombleData();
    wombleData[param] = value;

    localStorage.setItem('wombleData',JSON.stringify(wombleData));
}

const getWombleDataValue = (param)=>{
    return getWombleData()[param]
}

export {getWombleData, setWombleDataParam, getWombleDataValue};