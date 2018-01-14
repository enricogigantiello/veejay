import React from 'react';
import { Route, Link } from 'react-router-dom'
import Home from '../home'
import About from '../about'
import Mixer from '../mixer'

const App = () => (
  <div>
    <header>
      <Link to="/">Mixer</Link>
      <Link to="/about-us">About</Link>
      <Link to="/counter">counter</Link>
    </header>

    <main>
      <Route exact path="/" component={Mixer} />
      <Route exact path="/about-us" component={About} />
      <Route exact path="/counter" component={Home} />
    </main>
  </div>
)

export default App
