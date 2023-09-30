import React from 'react';
import { useDrag } from 'react-dnd';
import { baseUrl } from '../scripts/constants.js';

const Item = ({ itemData }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'item',
        item: { 'type': 'item', 'data': itemData },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));

    return (
        <div
            ref={drag}
            className = 'item'
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
                height: '60px',
                width: '60px',
                backgroundImage: `url(${baseUrl + itemData.img})`,
                backgroundSize: 'cover',
                borderStyle: 'solid',
                borderWidth: '3px'
            }}
            alt={itemData.name} 
            onClick={() => console.log(itemData.incompatibleTraits)}
        >
        </div>
    );
}

export default Item;