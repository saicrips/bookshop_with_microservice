import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import CssBaseline from '@mui/material/CssBaseline'

import Keycloak from 'keycloak-js'

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_BFF_URL,
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

const keycloak = new Keycloak({
  url: 'http://127.0.0.1:8080',
  realm: 'gihyo-ms',
  clientId: 'frontend',
})

keycloak.onAuthSuccess = function () {
  // alert('authenticated')
  localStorage.setItem('token', keycloak.token)
}

keycloak.onAuthLogout = function () {
  alert('logout')
  // localStorage.removeItem('token')
}

keycloak.init({ onLoad: 'login-required' }).then((auth) => {
  if (!auth) {
    console.log('not Authenticated')
  } else {
    console.log('Authenticated')
    console.log(keycloak)
    localStorage.setItem('token', keycloak.token)

    // console.log(auth)
    // console.log(keycloak)
    // keycloak
    //   .loadUserProfile()
    //   .then(function (profile) {
    //     console.log(JSON.stringify(profile, null, '  '))
    //   })
    //   .catch(function () {
    //     alert('Failed to load user profile')
    //   })
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <CssBaseline />
    <ApolloProvider client={client}>
      <App keycloak={keycloak}/>
    </ApolloProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
