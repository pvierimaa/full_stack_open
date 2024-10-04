import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { gql, useApolloClient, useSubscription } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    author {
      name
    }
    genres
  }
`

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

const ALL_BOOKS = gql`
  query allBooks {
    allBooks(genre: null) {
      title
      author {
        name
      }
      published
    }
  }
`

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [genre, setGenre] = useState('all genres')
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      window.alert(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    },
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>

        <Authors show={page === 'authors'} token={token} />

        <Books show={page === 'books'} genre={genre} setGenre={setGenre} />

        <LoginForm show={page === 'login'} setToken={setToken} />
      </div>
    )
  } else {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={() => setPage('recommend')}>recommend</button>
          <button onClick={logout}>logout</button>
        </div>

        <Authors show={page === 'authors'} token={token} />

        <Books show={page === 'books'} genre={genre} setGenre={setGenre} />

        <NewBook show={page === 'add'} />

        <Recommendations show={page === 'recommend'} />
      </div>
    )
  }
}

export default App
