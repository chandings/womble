
export default function Meanings({meanings}) {
  return (
    meanings.map((meaning,meaningIndex)=>{
        return (<div key={"meaningOuter"+meaningIndex}>
            {meaning.partOfSpeech}
            {meaning.definitions.map((definition,defIndex)=>(
                    <div key={"definitions"+defIndex}>{definition.definition}</div>
                )
            )}
        </div>)
    })
  )
}
