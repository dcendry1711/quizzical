import { useState, useEffect } from 'react'
import { decode } from 'html-entities'

export function App() {

  const [dataForQuiz, setDataForQuiz] = useState([])
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if(isGameStarted)
      {
        setIsLoading(true)
        fetch('https://opentdb.com/api.php?amount=5&difficulty=easy')
          .then(res => res.json())
          .then(data => setDataForQuiz(data.results))
          setIsLoading(false)
      }
  }, [isGameStarted])

  const questionEl = dataForQuiz.length>0 ?
    dataForQuiz.map((obj,index) =>{

      const decodedQuestion = decode(obj.question)

      function shuffle(arr){
        const copy = [...arr]
        for (let i = copy.length - 1 ; i > 0 ; i--){
          const j = Math.floor(Math.random()*(i+1))
          ;[copy[i],copy[j]] = [copy[j],copy[i]]
        }
        return copy
      }

      const shuffledAns = shuffle([
        ...obj.incorrect_answers, 
        obj.correct_answer
      ])

      return(
        <section className="single-question" key={index}>
          <h2>{decodedQuestion}</h2>
          <div className="answer-container"> 
            {shuffledAns.map((ans,i) => <button>{ans}</button>)}
          </div>
        </section>
      )

    }) : null

    function renderQuestions(){
      setIsGameStarted(true)
    }

  return (
    <main>
     {!isGameStarted ? 
     (
      <header>
        <h1>Quizzical</h1>
        <p>Do you wanna some questions???</p>
        <button onClick={renderQuestions}>Start game</button>
      </header>
     ): isLoading ? (<p>Pytania się ładują</p>) : (questionEl)
    }
    </main>
  )
}
