import React, { useState, useEffect, useCallback } from 'react';
import Hex from './Hex.js';
import Trait from './Trait.js';

const Board = ({ traitData }) => {
    const [, updateState] = useState();
    const [boardState, setBoardState] = useState([]);
    const [activeUnits, setActiveUnits] = useState({});
    const [activeTraits, setActiveTraits] = useState({});
    const forceUpdate = useCallback(() => updateState({}), []);

    // resets the board
    const resetBoard = () => {
        var temp = Array(4);
        for (var i = 0; i < 4; i++) {
            temp[i] = Array(7)
            for (var j = 0; j < 7; j++) {
                temp[i][j] = { 'champData': null, 'itemData': [] };
            }
        }
        setBoardState(temp);
        setActiveUnits({});
        setActiveTraits({});
    }

    // resets board on first render
    useEffect(() => {
        resetBoard();
    }, []);

    useEffect(() => {
        console.log(activeTraits);
    }, [activeTraits]);

    // Clears a hex
    const removeUnit = (row, column) => {
        var temp = boardState;
        var traitsToRemove = [];

        if (!temp[row][column].champData) {
            return;
        }

        // Updates the list of active traits
        traitsToRemove = temp[row][column].champData.traits;
        var champName = temp[row][column].champData.name;
        temp[row][column].itemData.forEach((item) => {
            traitsToRemove = traitsToRemove.concat(item.incompatibleTraits)
        })

        if (activeUnits.hasOwnProperty(champName) && activeUnits[champName] === 1) {
            changeTraits(traitsToRemove, false);
        }
        changeUnits(temp[row][column].champData.name, false);

        // Clears the data for the target hex
        temp[row][column].champData = null;
        temp[row][column].itemData = [];
        setBoardState(temp);
        forceUpdate();
    }

    // Removes an item from a hex
    const removeItem = (name, row, column) => {
        var temp = boardState;
        var hex = temp[row][column];

        changeTraits(hex.itemData.filter(item => item.name === name)[0].incompatibleTraits, false)

        hex.itemData = hex.itemData.filter(item => item.name !== name);

        setBoardState(temp);
        forceUpdate();
    }

    const changeUnits = (unitName, isAdding) => {
        var curActive = activeUnits;

        // If the trait exists in the list and should be incremented
        if (isAdding && curActive.hasOwnProperty(unitName)) {
            curActive[unitName] += 1;

        // If the trait does not exist and should be incremented
        } else if (isAdding) {
            curActive[unitName] = 1;

        // If the trait should be decremented
        } else {
            curActive[unitName] -= 1;

            if (curActive[unitName] === 0) {
                delete curActive[unitName];
            }
        }

        setActiveUnits(curActive);
        

    }

    // Updates the list of active traits on the board
    const changeTraits = (traits, isAdding) => {
        var curActive = activeTraits;

        // Iterates through the list of traits to update
        traits.forEach((trait) => {

            // If the trait exists in the list and should be incremented
            if (isAdding && curActive.hasOwnProperty(trait)) {
                curActive[trait] += 1;

            // If the trait does not exist and should be incremented
            } else if (isAdding) {
                curActive[trait] = 1;

            // If the trait should be decremented
            } else {
                curActive[trait] -= 1;

                if (curActive[trait] === 0) {
                    delete curActive[trait];
                }
            }
        });

        setActiveTraits(curActive);
    }

    // Adds a unit or item to a hex
    const onDrop = (type, data, row, column) => {
        var temp = boardState;
        var hex = temp[row][column];
        var champ = hex.champData;
        var items = hex.itemData;

        // checks whether the dropped component is unit
        if (type === 'unit') {
            hex.champData = data;

            if (!activeUnits.hasOwnProperty(data.name)) {
                changeTraits(data.traits, true);
            }
            
            changeUnits(data.name, true);
        
        // checks that the dropped component is an item and that the hex has a unit
        } else if (type === 'item' && champ !== null) {

            // checks if there are too many items (max 3)
            if (items.length > 2){
                console.log('This unit cannot hold another item.');
                return;

            // checks if the item is an invalid emblem
            // (emblems cannot be dropped on units that already have the trait)
            } else if (data.incompatibleTraits.some((trait) => champ.traits.includes(trait))) {
                console.log('This unit already has that trait.');
                return;

            // checks if the item is unique. 
            // If it is unique confirms that the item isn't already assigned
            } else if (data.unique && items.some((item) => item.name === data.name)) {
                console.log('A unit can only have one of that item.');
                return;
            
            // Checks that the unit can hold items
            } else if (hex.champData.traits.length === 0) {
                console.log('This unit cannot hold any items');
                return;
            }
            
            hex.itemData.push(data);
            changeTraits(data.incompatibleTraits, true);
        }

        setBoardState(temp);
        forceUpdate();
    }

    return (
        <div className='board'>
            <div className="container">
                {boardState.map((arr, i) => (
                    <div className="row" key={i}>
                        {arr.map((hexData, j) => {
                            return (<Hex 
                                key={j}
                                content={hexData} 
                                onDrop={onDrop}
                                removeUnit={removeUnit}
                                removeItem={removeItem}
                                row={i}
                                column={j}
                            />)
                        })}
                    </div>
                ))}
            </div>
            <div className="traits">
                {traitData.filter((trait) => Object.keys(activeTraits).includes(trait.name)).map((trait) => (
                    <Trait traitData={trait} numActive={activeTraits[trait.name]}/>
                ))}
            </div>
        </div>
    );
}

export default Board;