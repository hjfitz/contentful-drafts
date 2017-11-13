import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './home.jsx';

const onUpdate = () => window.scrollTo(0, 0);

const App = () => (
  <Router onUpdate={onUpdate}>
    <Route exact path="/" component={Home} />
  </Router>
);

const entry = document.getElementById('react-root');

render(<App />, entry);

