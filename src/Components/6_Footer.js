import React, { Component } from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import Data from './data.json';

class Footer extends Component {
  render() {
    return (
      <footer>

      <div className="row">
          <div className="twelve columns footnote">
              <p> Last updated {Data.lastUpdated} </p>
              <ul>
                  <li>&copy; Copyright 2019 Isabelle Sauv&eacute;</li>
                  <li>Design by <a title="Styleshout" href="https://www.styleshout.com/demo/?theme=ceevee" target="_blank">Styleshout</a></li>
                  <li>Based on <a title="" href="https://github.com/tbakerx/react-resume-template" target="_blank">tbakerx/react-resume-template</a></li>
              </ul>
          </div>
          <div id="go-top"><AnchorLink href='#home'><i className="fa fa-angle-up"></i></AnchorLink></div>
      </div>

      </footer>
    );
  }
}

export default Footer;
