import axios from 'axios';
let levelsData = []
const baseURL = 'https://chandings.github.io/womblejsoncreator/WombleJSONs/'

const loadLevelsFile = ()=>{
    console.log(baseURL+'levels.json');
    return axios.get(baseURL+'levels.json');
}

const setLevelsData = (levels)=>{ 
    levelsData = levels;
}

const nextWord =  (index)=>{
    let word = levelsData[index];
    return axios.get(baseURL+ word +'.json')
}

export {nextWord, loadLevelsFile, setLevelsData};