import { useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import Select from 'react-select'

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`
const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS, {
    pollInterval: 2000,
  })

  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [setBornTo, setSetBornTo] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR)

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors

  const authorOptions = authors.map((author) => ({
    value: author.name,
    label: author.name,
  }))

  const submit = async (event) => {
    event.preventDefault()

    editAuthor({
      variables: { name: selectedAuthor.value, setBornTo: parseInt(setBornTo) },
    })

    setSelectedAuthor(null)
    setSetBornTo('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <Select
            value={selectedAuthor}
            onChange={setSelectedAuthor}
            options={authorOptions}
          />
        </div>
        <div>
          born
          <input
            value={setBornTo}
            onChange={({ target }) => setSetBornTo(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
