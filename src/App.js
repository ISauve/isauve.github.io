import React, { Component } from 'react';
import Header from './Components/1_Header';
import Resume from './Components/2_Resume';
import Experience from './Components/3_Experience';
import Portfolio from './Components/4_Portfolio';
import Interests from './Components/5_Interests';
import Footer from './Components/6_Footer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <Resume/>
        <Experience/>
        <Interests/>
        <Portfolio/>
        <Footer/>
      </div>
    );
  }
}

export default App;
