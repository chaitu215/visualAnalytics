// divide all trips into a square grid cell
// (c) 2018, suphanut jamonnak
import {layers, addMapLayer } from '../../component';
import { getCurrentMap} from '../../../main/geovisuals';
export default function (trips, cellWidth, options) {

    // collection of all points in grid cell
    let allPoints = [];

    for (let i = 0, len = trips.length; i < len; ++i) {
    
        let trip = trips[i];
        // get all narrative points
        let points = getSentimentPoints(trip);
        allPoints = allPoints.concat(points);
    }

    // create turf point feature collections
    let collection = turf.featureCollection(allPoints);
    // bounding box for current collection
    let boundingBox = turf.bbox(collection);
    // create square grid
    let squareGrid = turf.squareGrid(boundingBox, cellWidth, options);

    layers.regionCellNumber.clearLayers();
    //let pins = [];
    
    turf.featureEach(squareGrid, function (cell, idx) {
        //console.log(cell);
        var myIcon = L.divIcon({
            className: 'cells-number',
            html: idx
        });

        // Get centroid of each grid
        var pin = turf.centroid(cell);
        var marker = L.geoJSON(pin, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: myIcon });
            }
        });
        layers.regionCellNumber.addLayer(marker);
    });
    addMapLayer(getCurrentMap(), layers.regionCellNumber);

    // merge collection into square grid
    let cells = turf.collect(squareGrid, collection, 'score', 'score');
    cells = turf.collect(squareGrid,collection, 'narrative', 'narrative');
    
    let max = 0;
    let min = 0;
    // count all points in cells
    cells.features.forEach( function (d) {
        let sum = d.properties.score.reduce((a, b) => a + b, 0);
        d.properties.score = sum;
        // get max count for normalize
        if (sum > max) { max = sum; }
        if (sum < min) { min = sum; }
    });

    // normalize count
    cells.features.forEach( function (d) {
        // prevent
        if (d.properties.score == 0) {
            d.properties.score = 0;
        } else {
            d.properties.score = normalize(d.properties.score, [min, max], [-100, 100]);
        }
    });

    return cells;
}

// get all narrative point of specific trip
function getSentimentPoints (trip) {
    // collection of all points in grid cell
    let points = [];
    for (let i = 0, len = trip.sentiments.length; i < len; ++i) {
        
        let sentiment = trip.sentiments[i];
        let point = turf.point([trip.path[i][1], trip.path[i][0]]);
        point.properties.narrative = trip.narratives[i];
        if (sentiment != 0) {
            point.properties.score = sentiment;
        } else {
            point.properties.score = 0;
        }
        // add narrative point to the collection
        points.push(point);   
    }
    return points;
}

// normalize count to percentage
function normalize (value, r1, r2) {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}