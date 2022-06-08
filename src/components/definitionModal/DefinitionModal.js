import ReactDom from "react-dom"
import "./DefinitionModal.scss"
import Meanings from "./meanings/Meanings"
import Phonetics from "./phonetics/Phonetics"

export default function DefinitionModal({close,word,data,gotDefinition}) {
    const googleSearchPath = "https://www.google.com/search?q=define+"+word.toLowerCase()
    const googleJSX = (<>
        <div className='modal-shadow'></div>
        <div className='definition-modal'>
            <div className="modal-header">{word}<button className="app-help-close-btn" onClick={()=>{close(false)}}><i className="gg-close"></i></button> </div>
            <div className="modal-content">
                {googleSearchPath}
            </div>
            <div className="modal-footer"></div>
        </div>
        </>)
    const dataJSX = (<>
        <div className='modal-shadow'></div>
        <div className='definition-modal'>
            <div className="modal-header">{word}<button className="app-help-close-btn" onClick={()=>{close(false)}}><i className="gg-close"></i></button> </div>
            <div className="modal-content">
                <div >{data.map((definition, index)=>{
                    return <div className="modal-content-definition">
                    <Phonetics key={"phonetics"+index} phonetics={definition.phonetics}/>
                    <Meanings key={"meanings"+index} meanings={definition.meanings}/>
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
