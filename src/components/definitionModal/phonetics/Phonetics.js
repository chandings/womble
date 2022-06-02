import "./Phonetics.css";

export default function Phonetics({phonetics, index}) {
  return (
    phonetics.map((phonetic,phoneticIndex)=>{
        return <div>
            <label className="phonetic">{phonetic.text}</label>
            {(phonetic.audio)&&(<><audio id={"audio"+index+phoneticIndex}>
                <source src={phonetic.audio} type="audio/mpeg"></source>
            </audio>
            <button onClick={()=>{document.getElementById("audio"+index+phoneticIndex).play()}}>Play</button></>)}
        </div>
    })
  )
}
