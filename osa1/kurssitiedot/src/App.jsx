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
    < Part osa={props.osat[0].name} maara={props.osat[0].exercises}/> 
    < Part osa={props.osat[1].name} maara={props.osat[1].exercises}/> 
    < Part osa={props.osat[2].name} maara={props.osat[2].exercises}/> 
  </p>
  </div>
  )
}

const Total = (props) => {
  let ex_sum = 0;
  props.tehtavat.forEach(element => { ex_sum += element.exercises })
  return (
  <div>
  <p>
    Number of exercises {ex_sum}
  </p>
  </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      < Header kurssi={course.name} />
      < Content osat = {course.parts}/> 
      <Total tehtavat = {course.parts}/>
    </div>
  )
}

export default App