import React, { Component } from 'react';
import ReactFitText from 'react-fittext';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import Data from './data.json';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = { width: 0, height: 0 };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    updateDimensions() {
        this.setState({ height: window.innerHeight, width: window.innerWidth });
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    render() {
        return (
            <header style={{width: this.state.width + 'px', height: this.state.height + 'px'}} id="home">
            <nav id="nav-wrap">

                <a className="mobile-btn" href="#nav-wrap" title="Show navigation">Show navigation</a>
    	        <a className="mobile-btn" href="#home" title="Hide navigation">Hide navigation</a>
                <ul id="nav" className="nav">
                    <li className="current"><AnchorLink href='#home'>Home</AnchorLink></li>
                    <li><AnchorLink href='#resume'>Resume</AnchorLink></li>
                    <li><AnchorLink href='#experience'>Experience</AnchorLink></li>
                    <li><AnchorLink href='#interests'>Interests</AnchorLink></li>
                    <li><AnchorLink href='#portfolio'>Portfolio</AnchorLink></li>
                </ul>
            </nav>

            <div className="row banner">
                <div className="banner-text">
                <ReactFitText minFontSize={40} maxFontSize={90}>
                    <h1> I'm Isabelle Sauv&eacute;. </h1>
                </ReactFitText>

                    <h3>
                        { Data.description }
                    </h3>
                    <hr />
                        <ul className="social">
                        <li key="linkedin">
                            <a href="https://www.linkedin.com/in/isauve" rel="noopener noreferrer" target="_blank"><i className="fa fa-linkedin"></i></a>
                        </li>
                        <li key="github">
                            <a href="https://github.com/ISauve" rel="noopener noreferrer" target="_blank"> <i className="fa fa-github"></i></a>
                        </li>
                    </ul>
                </div>
            </div>

            <p className="scrolldown">
                <AnchorLink href='#resume'><i className="fa fa-angle-down"></i></AnchorLink>
            </p>
            </header>
    );
  }
}

export default Header;
