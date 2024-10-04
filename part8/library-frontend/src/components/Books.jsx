import { gql, useQuery } from '@apollo/client'

const ALL_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
      }
      published
    }
  }
`

const Books = (props) => {
  const result = useQuery(ALL_BOOKS, {
    variables: { genre: props.genre === 'all genres' ? null : props.genre },
  })

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

  const handleGenreChange = (genre) => {
    props.setGenre(genre)
    result.refetch({ genre: genre === 'all genres' ? null : genre })
  }

  return (
    <div>
      <h2>books</h2>
      in genre <strong>{props.genre}</strong>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => handleGenreChange('refactoring')}>refactoring</button>
      <button onClick={() => handleGenreChange('agile')}>agile</button>
      <button onClick={() => handleGenreChange('patterns')}>patterns</button>
      <button onClick={() => handleGenreChange('design')}>design</button>
      <button onClick={() => handleGenreChange('crime')}>crime</button>
      <button onClick={() => handleGenreChange('classic')}>classic</button>
      <button onClick={() => handleGenreChange('all genres')}>all genres</button>
    </div>
  )
}

export default Books
