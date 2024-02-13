import React, {useState} from 'react';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Tooltip.css';

const Tooltip = ({children}) => {
    const [active, setActive] = useState(false);
    const [delayHandler, setDelayHandler] = useState(null);

    const handleMouseEnter = () => {
        setDelayHandler(setTimeout(() => {
            setActive(true)
        }, 500))
    }

    const handleMouseLeave = () => {
        clearTimeout(delayHandler)
        setActive(false)
    }

    const tooltipStyle = {
        display: (active)? 'block': 'none'
    }

    return (
        <div className='tooltip__container'>
            <FontAwesomeIcon 
                className='tooltip__icon'
                icon={faQuestion}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
            <div className='tooltip__content' style={tooltipStyle}>
                {children}
            </div>
        </div>
    );
}

export default Tooltip;