import {useEffect, useState, useRef} from 'react';
import { Line } from 'react-lineto';
import "./DialPad.scss"

export default function DialPad({word, setLetter, inputDone, inputStart}) {
    const [selectedIndex,setSelectedIndex] = useState([])
    const [takingInput,setTakingInput] = useState(false)
    //const [selectedWord,setSelectedWord] = useState([])
    const [letterDetails,setLetterDetails] = useState([])
    const [coordinates,setCooridinate] = useState(null)
    
    const prevSelectedindex = useRef([]);


    useEffect(()=>{
        document.getElementsByTagName('body')[0].addEventListener("mouseup",mouseReleased);
        document.getElementsByTagName('body')[0].addEventListener("touchend",mouseReleased);
        
        return ()=>{
            document.getElementsByTagName('body')[0].removeEventListener("mouseup",mouseReleased);
            document.getElementsByTagName('body')[0].removeEventListener("touchend",mouseReleased);
        }
    },[]);

    useEffect(()=>{
        // !takingInput&&setSelectedWord(()=>{
        //     if(selectedIndex.length>0){
        //         letterDetails.forEach((details)=>{
        //             details.element.setAttribute("selected","false");
        //         })
        //         let playerWord = selectedIndex.map((index)=>word[index])
        //         inputDone(playerWord);
        //         return playerWord;
        //     }
        //     return [];
        // });
        if(!takingInput){
            let playerWord = selectedIndex.map((index)=>{
                    letterDetails[index].element.setAttribute("selected","false");
                    return word[index];
                })
            inputDone(playerWord);
        }
    },[takingInput]);

    useEffect(()=>{
        setLetterDetails([]);
         document.getElementsByName('letterbox').forEach((letterBox)=>{
            setLetterDetails((prevValue)=>{
                return [...prevValue,{
                    index:parseInt(letterBox.attributes['letterindex'].nodeValue),
                    x_min:letterBox.getBoundingClientRect().x,
                    y_min:letterBox.getBoundingClientRect().y, 
                    x_max:letterBox.getBoundingClientRect().width + letterBox.getBoundingClientRect().x,
                    y_max:letterBox.getBoundingClientRect().height + letterBox.getBoundingClientRect().y,
                    x_center:letterBox.getBoundingClientRect().x + letterBox.getBoundingClientRect().width/2,
                    y_center:letterBox.getBoundingClientRect().y + letterBox.getBoundingClientRect().height/2, 
                    
                    element:letterBox
                }]
            });
        });
    },[word]);

    useEffect(()=>{
        if(selectedIndex.length>0 && prevSelectedindex.current.length !== selectedIndex.length)
            setLetter(word[letterDetails[selectedIndex[selectedIndex.length-1]].index]);
    },[selectedIndex]);

    // useEffect(()=>{
    //     console.log(selectedWord);
    // },[selectedWord]);

    const mouseMove = (event)=>{
        if(takingInput){
            setCooridinate({x:event.clientX, y:event.clientY});
        }else{
            setCooridinate(null)
        }
    }

    const touchMoved=(event)=>{
        const x = event.touches[0].clientX;
        const y = event.touches[0].clientY;
        if(takingInput){
            setCooridinate({x, y});
        }else{
            setCooridinate(null)
        }
        letterDetails.forEach((details)=>{
            if(x>details.x_min && x<details.x_max && y>details.y_min && y<details.y_max){
                details.element.setAttribute("selected","true")
                setSelectedIndex((prevValue)=>{
                    if(prevValue.indexOf(details.index) === -1){
                        prevSelectedindex.current = prevValue;
                        return [...prevValue, details.index]
                    }
                    return prevValue;
                });
            }
        })
    }

    const keyPressed=(index,element)=>{
        setTakingInput(true);
        prevSelectedindex.current = [index];
        setSelectedIndex([index])
        setCooridinate(null)
        element.setAttribute("selected","true");
        inputStart(word[index]);

    }

    const mouseReleased=()=>{
        setTakingInput(false);
    }

    const keyOver=(index)=>{
        if(takingInput){
            letterDetails[index].element.setAttribute("selected","true");
            setSelectedIndex((prevValue)=>{
                if(prevValue.indexOf(index) === -1){
                    prevSelectedindex.current = prevValue;
                    return [...prevValue, index]
                }
                return prevValue
            })
        }
        
    }

    const letterButtonJSX = (index)=>{
        if(word[index]){
            return (
                <div 
                    key={"letterbox"+index}
                    name="letterbox" 
                    onMouseOver={()=>{keyOver(index)}} 
                    onMouseDown={(e)=>{keyPressed(index,e.target)}} 
                    onTouchStart={(e)=>{keyPressed(index,e.target)}}
                    letterindex ={index} 
                    className='dialpad-letter-button'>{word[index]}</div>
            )
        }
        return null
    }

    return (
        <div className="dialpad-container" onTouchMove={touchMoved} onMouseMove={mouseMove}>
        {takingInput&&selectedIndex.map((selected, index)=>{
            if(index===selectedIndex.length-1){
                if(coordinates){
                    return <Line 
                            key={"line"+index} 
                            borderColor={'#30501f'}
                            borderWidth={5}
                            x0={letterDetails[selected].x_center} 
                            y0={letterDetails[selected].y_center} 
                            x1={coordinates.x} 
                            y1={coordinates.y} />
                }else{
                    return <div key={"line"+index} />
                }
            }
            return <Line 
                        key={"line"+index} 
                        borderColor={'#30501f'}
                        borderWidth={5}
                        x0={letterDetails[selected].x_center} 
                        y0={letterDetails[selected].y_center} 
                        x1={letterDetails[selectedIndex[index+1]].x_center} 
                        y1={letterDetails[selectedIndex[index+1]].y_center} />
        })}
        <div className={'circle-container-'+(word.length)}>
            {word.map((letter,index)=>letterButtonJSX(index))}
        </div>
            {/* {word.map((letter,index)=>(<LetterButton index={index} key={index+level} letter={letter} level={level} letterCallback={letterClicked} resetCallback={getResetFunction}></LetterButton>))} */}
        </div>
    )
}
