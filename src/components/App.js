import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from "./Header";
import Home from "./Home";
import About from "./About";
import Post from "./Post";

const App = () => (
  <Router>
    <div>
      <Header />
      <main>
        <Route exact path="/" component={Home} />
        <Route path="/post/:slug" component={Post} />
        <Route path="/about" component={About} />
      </main>
    </div>
  </Router>
);

export default App;
