import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function Result({ correct, tryAgain, questions }) {
  return (
    <div className="result">
      <img src={require('./hooray.png')} id='congrats-pic'></img>
      <h1 class='smaller-text'>You have <b>{correct}</b> answers out of <b>{questions.length}</b>!</h1>
      <button id="try-again" onClick={tryAgain}>Try again</button>
    </div>
  );
}

function Game({ question, step, onClickVariant, questions }) { /* очень важно добавлять эти скобочки а то ничего не получится епрст */
  return (
    <div className='game'>
      <div className="w-full bg-gray-200 h-1 progress" style={{height: '7px'}}>
        <div className="bg-green-600 h-1 gradient" style={{width: `${Math.round(step / questions.length * 100)}%`, height: '7px'}}></div>
      </div>
      <h1 style={{textAlign: 'left', fontSize: 32, fontWeight: 600}}>{question.question.replace(/&.+;/g, '') }</h1>
      <ul style={{marginTop: '15px'}}>{
      [...question['incorrect_answers'], question['correct_answer']].sort(function(){
        return Math.random() - 0.5;
      }).map((a, index) => // насколько сам понял, индекс это такая встроенная темка, которая работает
      // всегда, когда мы мап используем, ее можем передавать, чтобы просто отслеживать индекс элемента в массиве
        <div className='question'>
          <li key={a} className='answer' onClick={() => onClickVariant(a)}> {/* стрелочка функция позволяет вот так красиво вызвать функцию с аргументом */}
            {
              // a.replace(/&quot;/g,'').replace(/&#039;/g, '').replace(/&ldquo;/g, '').replace(/&hellip;/g, '').replace(/&rdquo;/g, '').replace(/&rsquo;/g, '').replace(/&amp;/g, '')
              a.replace(/&.+;/g, '') 
            }
          </li>
        </div>)}
      </ul>
    </div>
  );
}

function App() {
  const [step, setStep] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const question = questions[step];

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple')
      // .then((data) => (data.json()))
      .then((data) => (data.json()))
      .then((json) => { 
        setQuestions(json.results);
        setIsLoaded(true);
      });
  }, []);

  const onClickVariant = (answer) => {
    console.log(step);
    console.log(answer);
    if (answer == question.correct_answer)
      setCorrect(correct + 1);
    setStep(step + 1);
  }

  const tryAgain = () => {
    setStep(0);
    setCorrect(0);
  }

  // что я понял из создания квиза - все определяют родители, сами дочерние компоненты от них только принимают
  // инфу в виде свойств, поэтому это такой прикольный принцип, можно запомнить, что как в жизни
  // живем как мама скажет

  return (
    <div className="App">
      { (!isLoaded) ? <></> 
        : ((step != questions.length) ? <Game step={step} questions={questions} question={question} onClickVariant={onClickVariant}/> : <Result correct={correct} tryAgain={tryAgain} questions={questions}/>) }
    </div>
  )
}

export default App
