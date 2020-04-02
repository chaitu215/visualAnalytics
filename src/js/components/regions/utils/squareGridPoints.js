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
        let points = getNarrativePoints(trip);
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
    let cells = turf.collect(squareGrid, collection, 'count', 'count');
    cells = turf.collect(squareGrid,collection, 'narrative', 'narrative');
    cells = turf.collect(squareGrid, collection, 'keyword', 'keyword');
    
    let max = 0;
    // count all points in cells
    cells.features.forEach( function (d) {
        let sum = d.properties.count.reduce((a, b) => a + b, 0);
        // get max count for normalize
        if (sum > max) { max = sum; }
        d.properties.count = sum;
    });

    // normalize count
    cells.features.forEach( function (d) {
        d.properties.count = normalize(d.properties.count, [0, max], [0, 100]);
    });

    return cells;
}

// get all narrative point of specific trip
function getNarrativePoints (trip) {
    // collection of all points in grid cell
    let points = [];
    for (let i = 0, len = trip.narratives.length; i < len; ++i) {
        // check if narrative exists
        if (trip.narratives[i] !== 'none') {
            // create geojson point
            let point = turf.point([trip.path[i][1], trip.path[i][0]]);
            // point properties
            point.properties.keyword = trip.keywords[i];
            point.properties.narrative = trip.narratives[i];
            point.properties.count = 1;
            // add narrative point to the collection
            points.push(point);
        }
    }

    return points;
}

// normalize count to percentage
function normalize (value, r1, r2) {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}