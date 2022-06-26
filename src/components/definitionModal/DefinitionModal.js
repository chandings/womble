import ReactDom from "react-dom"
import "./DefinitionModal.scss"
import Meanings from "./meanings/Meanings"
import Phonetics from "./phonetics/Phonetics"
import * as faIcons from "react-icons/fa";

export default function DefinitionModal({close,word,data,gotDefinition}) {
    const googleSearchPath = "https://www.google.com/search?q=define+"+word.toLowerCase()
    const googleJSX = (<>
        <div className='blur-modal'></div>
        <div className='definition-modal'>
            <div className="modal-header">{word}<button className="close-btn-dark" onClick={()=>{close(false)}}><faIcons.FaTimes/></button> </div>
            <div className="modal-content">
                {googleSearchPath}
            </div>
            <div className="modal-footer"></div>
        </div>
        </>)
    const dataJSX = (<>
        <div className='blur-modal'></div>
        <div className='definition-modal'>
            <div className="modal-header">{word}<button className="close-btn-dark" onClick={()=>{close(false)}}><faIcons.FaTimes/></button> </div>
            <div className="modal-content">
                <div >{data.map((definition, index)=>{
                    return <div  key={"definitionOuter"+index}  className="modal-content-definition">
                    <Phonetics phonetics={definition.phonetics}/>
                    <Meanings meanings={definition.meanings}/>
                    </div>
                })}
                </div>
            </div>
        </div>
        </>)
   if(gotDefinition){
       console.log(data);
        return ReactDom.createPortal(dataJSX,document.getElementById('root'));
    }
    return ReactDom.createPortal(googleJSX,document.getElementById('root'));

}
