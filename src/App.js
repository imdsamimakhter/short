import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ShortenLink from './components/ShortenLink';
import LinkList from './components/LinkList';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={ShortenLink} />
          <Route path="/links" component={LinkList} />
          {/* No need for /download here, as it's handled by the backend */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
