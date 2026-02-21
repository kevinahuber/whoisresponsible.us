import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.scss'
import { Home } from './scenes'
import { initStore } from './store'

const store = initStore()
const root = createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <Home />
  </Provider>
)
