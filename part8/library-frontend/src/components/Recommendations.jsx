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

const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

const Recommendations = (props) => {
  const result_me = useQuery(ME, {
    pollInterval: 2000,
  })

  const user = result_me.data?.me

  const result = useQuery(ALL_BOOKS, {
    variables: { genre: user?.favoriteGenre || null },
    pollInterval: 2000,
    skip: !user,
  })

  if (!props.show) {
    return null
  }

  if (result_me.loading || !user) {
    return <div>loading user information...</div>
  }

  if (result.loading || !result.data) {
    return <div>loading books...</div>
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>recommendations</h2>
      books in your favorite genre <strong>{user.favoriteGenre}</strong>
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
    </div>
  )
}

export default Recommendations
