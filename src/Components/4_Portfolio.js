import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import Data from './data.json';
import Games from './Games.js';

class Portfolio extends Component {
    constructor() {
        super();
        this.state = {
            openModal: -1,
            height: 0
        };

        this.onOpenModal = this.onOpenModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.project = React.createRef();
    }

    onOpenModal = (modalNum) => {
        this.setState({ openModal: modalNum });
    };

    onCloseModal = () => {
        this.setState({ openModal: -1 });
    };

    updateDimensions = () => {
        this.setState({ height: this.project.current.offsetWidth * 0.75 });
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    render() {
        let _this = this;
        var projects = Data.projects.map( function(project, i) {

            var media;
            if (project.title === "Retro Games") {
                media = <Games/>
            } else if (project.hasDemoImg) {
                media = <img alt={project.title + '_more_info'}
                             src={require("../images/demos/" + project.demo_image)}
                        />
            }

            var awards = project.awards.map( function(award, i) {
                if (i === 0) {
                    return (
                        <span key={i}>
                            <p className="award first"> {award} </p>
                        </span>
                    );
                }
                return (
                    <span key={i}>
                        <p className="award"> {award} </p>
                    </span>
                );
            });

            var urlContents = project.urls.map( function(url, i) {
                return (
                    <span key={url.link}>
                        <a href={url.link} target="_blank" rel="noopener noreferrer"> {url.name} </a>
                        &nbsp;
                    </span>
                );
            });

            // eslint-disable-next-line
            var closeLink = <a href="#" onClick={ () => { _this.onCloseModal(i) }}> close </a>

            return <div key={project.title} className="columns portfolio-item" ref={_this.project}>

                <div className="item-wrap" onClick={ () => { _this.onOpenModal(i) } }>

                    <img alt={project.title}
                         src={require("../images/portfolio/" + project.image)}
                         style={{width: '100%', height: _this.state.height}}
                    />

                    <div className="overlay">
                        <div className="portfolio-item-meta">
                            <h5>{project.title}</h5>
                            <p> {project.category} </p>
                        </div>
                    </div>

                    <div className="link-icon"><i className="fa fa-plus"></i></div>
                </div>

                <Modal open={ _this.state.openModal === i }
                       onClose={_this.onCloseModal}
                       center
                       showCloseIcon={false}
                >
                    <div className="customModal">
                        { media }
                        <div className="description">
                            <h4> {project.title} </h4>
                            <p> { project.description } </p>
                            { awards }
                        </div>
                        <div className="linkbox">
                            { urlContents }
                            { closeLink }
                        </div>
                    </div>
                </Modal>

            </div>
        })
        return (
          <section id="portfolio">
          <div className="row">
              <div className="twelve columns collapsed">
                  <h1>Check Out Some of My Work.</h1>
                  <div id="portfolio-wrapper" className="bgrid-quarters s-bgrid-thirds cf">
                      {projects}
                  </div>
              </div>
          </div>
          </section>
        );
    }
}

export default Portfolio;
