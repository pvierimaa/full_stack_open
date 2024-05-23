import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistics = (props) => {
  if (props.good === 0 && props.neutral === 0 && props.bad === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }  
  return (
    <div>
      <table>
        <tbody>
          <StatisticsLine text = "good" value = {props.good}  />
          <StatisticsLine text = "neutral" value = {props.neutral} />
          <StatisticsLine text = "bad" value = {props.bad} />
          <StatisticsLine text = "all" value = {props.good + props.neutral + props.bad} />
          <StatisticsLine text = "average" value = {(props.good - props.bad) / (props.good + props.neutral + props.bad)} />
          <StatisticsLine text = "positive" value = {((props.good / (props.good + props.neutral + props.bad)) * 100) + ' %'} />
        </tbody>
      </table>
    </div>
  )
}

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incrementGood = newValue => {
    setGood(newValue)
  }
  
  const incrementNeutral = newValue => {
    setNeutral(newValue)
  }

  const incrementBad = newValue => {
    setBad(newValue)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => incrementGood(good + 1)} text="good" />
      <Button handleClick={() => incrementNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => incrementBad(bad + 1)} text="bad" />
      <h1>statistics</h1>
      <Statistics good = {good} neutral = {neutral} bad = {bad}/>
    </div>
  )
}

export default App