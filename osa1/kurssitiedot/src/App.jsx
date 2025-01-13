const Header = (props) => {
  return (
  <div>
  <h1>{props.kurssi}</h1>
  </div>
  )
}

const Part = (props) => {
  return (
  <div>
  <p>
    {props.osa} {props.maara}
  </p>
  </div>
  )
}

const Content = (props) => {
  return (
  <div>
  <p>
    < Part osa={props.osa1} maara={props.maara1}/> 
    < Part osa={props.osa2} maara={props.maara2}/> 
    < Part osa={props.osa3} maara={props.maara3}/> 
  </p>
  </div>
  )
}

const Total = (props) => {
  return (
  <div>
  <p>Number of exercises {props.tehtavat1 + props.tehtavat2 + props.tehtavat3}</p>
  </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      < Header kurssi={course} />
      < Content 
      osa1={part1} maara1={exercises1}
      osa2={part2} maara2={exercises2}
      osa3={part3} maara3={exercises3}/> 
      < Total tehtavat1={exercises1} tehtavat2={exercises2} tehtavat3={exercises3}/>
    </div>
  )
}

export default App