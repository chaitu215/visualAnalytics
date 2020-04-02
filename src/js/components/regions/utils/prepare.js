import {currentOptions} from '../ui/regionOptions';
import { default as dom } from '../ui/dom';
import { default as computeSquareGrids } from './squareGrid';
import { default as computeHexGrids } from './hexGrids';

/**
 * preprocess all trips data into different grid points
 * @param {*} trips 
 */
export default function (trips) {

    // get current cell distance
    let cellWidth = dom.cellwidthSlider.val();
    // grid options
    let options = {units: 'miles'};
    // square grids data
    if (currentOptions.square) {
        return computeSquareGrids(trips, cellWidth, options);
    }
    // hexagon grids data
    if (currentOptions.hexagon) {
        return computeHexGrids(trips, cellWidth, options);
    }

    return;
}