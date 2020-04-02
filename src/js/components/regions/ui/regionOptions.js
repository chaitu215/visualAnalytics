import {default as dom } from './dom';
import { default as reinitialize } from '../init';

// all current region options
export var currentOptions = {
    square: true,
    hexagon: false,
    zipcode: false // future;
}

// set region options events
export default function (trips, indexes) {
    dom.regionInput.off().on('click', (e) => {
        e.stopPropagation();
        if (dom.squareGridRadio.is(':checked')) {
            reset();
            currentOptions.square = true;
            reinitialize(trips, indexes);
            return;
        }

        if (dom.hexGridRadio.is(':checked')) {
            reset();
            currentOptions.hexagon = true;
            reinitialize(trips, indexes);
            return;
        }
    });

    // reset all region options
    function reset () {
        Object.keys(currentOptions).forEach( (option) => {
            currentOptions[option] = false;
        });
        return;
    }

    return;
}