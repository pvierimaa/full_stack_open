const Course = ({ course }) => {
    return (
    <div>
      <Header course = {course.name} /> 
      <Content parts = {course.parts} />
      <Total parts = {course.parts} />  
    </div>
    )
  }
  
  const Header = ({ course }) => {
    return(
    <div>
     <h2>{course}</h2> 
    </div>
    )
  }
  
  const Content = ({ parts }) => {
    return(
      <div>
        {parts.map(part =>
        <Part key={part.id} name = {part.name} exercises = {part.exercises} />
        )}
      </div>
    )  
  }
  
  const Part = ({ name, exercises }) => {
    return(
      <div>
        <p>
          {name} {exercises}
        </p>
      </div>
    )  
  }
  
  const Total = ({ parts }) => {
    const total = parts.reduce((accumulator, exercise) => {
       return accumulator + exercise.exercises
    },  0)

    return(
      <div>
        <p><strong>total of {total} exercises</strong></p>
      </div>
    )  
  }

  export default Course