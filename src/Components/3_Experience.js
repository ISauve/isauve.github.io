import React, { Component } from 'react';
import Data from './data.json';

class Experience extends Component {
  render() {
      var education = Data.education.map(function(education){
        return <div key={ education.school }>
                   <h3> { education.school }</h3>
                   <p className="info"> { education.degree }
                   <span>&bull;</span><em className="date"> { education.date }</em></p>
                   <p> <strong>{ education.major }</strong> <br/>
                        { education.description }
                   </p>
                </div>
      });

      var work = Data.work.map(function(work){
        return <div key={work.company}>
                <img alt={work.company} className="pic" src={require("../images/experience/" + work.image)}/>
                <h3>{work.company}</h3>
                <p className="info">{work.title}<span>&bull;</span> <em className="date">{work.years}</em></p>
                <p>{work.description}</p>
            </div>
      });

      return (
          <section id="experience">

          <div className="row education">
             <div className="three columns header-col">
                <h1><span>Education</span></h1>
             </div>

             <div className="nine columns main-col">
                {education}
            </div>
          </div>

          <div className="row work">
             <div className="three columns header-col">
                <h1><span>Work</span></h1>
             </div>

             <div className="nine columns main-col">
                {work}
            </div>
          </div>

          </section>
    );
  }
}

export default Experience;
