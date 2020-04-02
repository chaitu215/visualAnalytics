import { menus, modes, indexes, getCurrentMap, reset_detail_view } from "../../main/geovisuals";
import { default as setRegionOptions } from './ui/regionOptions';
import { default as setSlider } from './ui/cellwidthSlider';
import { default as prepareData } from './utils/prepare';
import { default as drawHeatmap } from './map/display/heatmap';
import { default as drawDefaultTrips } from './map/display/trip';
import { default as listRegions } from './ui/listRegion';
import { selectList, selectRoi } from './ui/selectRegion';
import { default as drawBubble } from './vis/bubble';
import {removeAllLayer, keywordTree} from '../component';
import { default as sentimentHeatmap } from './map/display/sentimentHeatmap';
import { default as drawSentimentline } from './vis/line';
import { default as showSelectRegion } from './map/display/selectSentimentRegion'
import { default as layers } from './map/layers';

/**
 * Initialize spatial regions
 * @param {*} trips 
 */
export default function (trips, index) {

    reset_detail_view();

    // remove all layer
    removeAllLayer(getCurrentMap());
    layers.selectRegion.clearLayers();

    // create ui events
    setRegionOptions(trips, index);
    setSlider(trips, index);
    // Prepare data (with region type and )
    var cells = prepareData(trips);

    // Process predata
    var processed = manageCellByCount(cells, index);
    // list all regions
    listRegions(processed, index);
    // show select regions
    (modes.roiSelection) ? selectRoi(indexes.roi) : selectList(indexes.roi, indexes.lists);

    // Region semantic bubble view
    if (menus.semanticBubble) {

        $('#map').css({ 'height' : '100%' });
        $('#showcase').css({ 'height' : '0%' });
        // draw heatmap
        drawHeatmap(processed, index);
        // draw semantic bubble
        drawBubble(processed, index);
        
    } else if (menus.sentimentChart) {
        // draw sentiment heatmap
        sentimentHeatmap(processed, index);
        var selectedCells = drawSentimentline(processed, index);
        showSelectRegion(selectedCells);
    } else if (menus.keywordTree) {

        // Fix map height
        $('#map').css({ 'height' : '49.5%' });
        $('#showcase').css({ 'height' : '49.3%' });
        // draw heatmap
        drawHeatmap(processed, index);

        // Need to create same as streets datastructure
        
        // Detect if all city or not
        // Detect if street data or not

        // draw keyword tree
        keywordTree(processed);
    }

    return;
}

function manageCellByCount (cells, list) {
    let regions = [];
    cells.features.forEach( (cell) => {

        let region = {
            geometry: cell,
            count: cell.properties.total,
            dates: cell.properties.dates,
            keywords: cell.properties.keywords,
            narratives: cell.properties.narratives,
            locations: cell.properties.locations,
            roadIds: cell.properties.roadIds,
            sentiments: cell.properties.sentiments,
            videos: cell.properties.videos,
            times: cell.properties.times
        }

        regions.push(region);
    });

    // remove sorting
    regions.sort(function(a, b){return b.count - a.count});

    var index = 0;
    regions.forEach( region => {
        region.index = index + 1;
        // modify geometry index
        region.geometry.properties.index = index + 1;
        region.geometry.properties.select = (list.indexOf(index + 1) !== -1) ? true : false; 
        ++index;
    });
    return regions;
}