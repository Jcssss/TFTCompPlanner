import React from 'react';
import { baseUrl }from '../../scripts/constants.js';

// A trait rendered in the Board component
const Trait = ({ traitData, numActive }) => {

    // Renders the intervals for the given Trait
    const createInterval = (num, i) => {
        return <React.Fragment key={num}>
            <div className={`arrow ${(numActive < num)? '':'highlight'}`}>
                {(i !== 0)? '>' : ''}
            </div>
            <div className={`num ${(numActive < num)? '':'highlight'}`}>
                {num}
            </div>
        </React.Fragment>
    }

    return (
        <div className='trait-container flex'>
            <div 
                className='trait-icon'
                style={{
                    backgroundImage: `url(${baseUrl + traitData.img})`,
                }}
            >
            </div>
            <div className='trait-active'>{numActive}</div>
            <div className='trait-body flex'>
                <div className='trait-name'>{traitData.name}</div>
                <div className='trait-intervals flex'>
                {
                    traitData.intervals.map((num, i) => {
                        return createInterval(num, i)
                    })
                }
                </div>
            </div>
        </div>
    );
}

export default Trait;