import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistic = (props) => {
  if (props.all === 0) {
    return <p>No feedback given</p>
  }
  return (
    <table>
      <tbody>
      <Statistiline text='good' value={props.good} />
      <Statistiline text='neutral' value={props.neutral} />
      <Statistiline text='bad' value={props.bad} />
      <Statistiline text='all' value={props.all} />
      <Statistiline text='average' value={(props.good - props.bad) / props.all} />
      <Statistiline text='positive' value={props.good / props.all * 100 + ' %'} />
      </tbody>
    </table>
  )
}

const Statistiline = (props) => (
  
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>
)
const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = good + neutral + bad
  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text='good'/>
      <Button handleClick={() => setNeutral(neutral + 1)} text='neutral'/>
      <Button handleClick={() => setBad(bad + 1)} text='bad'/>
      <h1>statistics</h1>
      <Statistic good={good} neutral={neutral} bad={bad} all={all} />
    </div>
  )
}

export default App