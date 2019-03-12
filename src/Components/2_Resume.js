import React, { Component } from 'react';

class Resume extends Component {
    render() {
        return (
            <section id="resume">
            <div className="row">
                <div className="main-col">
                    <h2>Looking for my r&eacute;sum&eacute;?</h2>
                    <div className="download">
                        <a className="link button"
                           href="Isabelle_Sauve_Resume.pdf"
                           target="_blank"
                        >
                            <i className="fa fa-download"></i>
                        </a>
                    </div>
                </div>
            </div>
            </section>
        );
    }
}

export default Resume;
