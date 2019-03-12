import React, { Component } from 'react';
import Data from './data.json';

class Interests extends Component {
    render() {
        var interests = Data.interests.map( function(interest, i) {
            return (<p  key={i} className="interest"> {interest} </p>);
        });

        return (
            <section id="interests">
                <div className="text-container">
                    <div className="row work">
                       <div className="three columns header-col">
                          <h1>Areas of Interest</h1>
                       </div>
                       <div className="nine columns main-col">
                          {interests}
                      </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Interests;
