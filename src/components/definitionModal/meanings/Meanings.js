
export default function Meanings({meanings}) {
  return (
    meanings.map((meaning,meaningIndex)=>{
        return (<div>
            {meaning.partOfSpeech}
            {meaning.definitions.map((definition,defIndex)=>(
                    <div>{definition.definition}</div>
                )
            )}
        </div>)
    })
  )
}
