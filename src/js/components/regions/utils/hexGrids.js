import turfCollect from '@turf/collect';
import turfHexGrid from '@turf/hex-grid'; // need to use hex-grid
import { getCurrentMap } from '../../../main/geovisuals';
/**
 * compute hex grid with turf.js
 * @param {*} trips all trips
 * @param {*} cellWidth cell distance 
 * @param {*} options distance units
 */
export default function (trips, cellWidth, options) {

    // get all point with narratives (sdps)
    let points = getTurfPoints(trips);
    // merge all points to grid cell
    let cells = mergeToHexGrid(points, cellWidth, options);
    return normalizeCellPoints(cells);
}

/**
 * get all narrative points in turf.js form
 * @param {*} trips 
 */
function getTurfPoints (trips) {
    let sdps = [];
    trips.forEach( (trip) => {
        for (let i = 0, len = trip.narratives.length; i < len; ++i) {
            // check if narrative existed
            if (trip.narratives[i] !== "none") {

                // Remove this after production!!!!!
                /*
                var latLng = L.latLng([trip.path[i][0], trip.path[i][1]]);
                var p = getCurrentMap().latLngToContainerPoint(latLng);
                var newPoint = L.point([p.x + 1000, p.y]);
                var newLatLng = getCurrentMap().containerPointToLatLng(newPoint);
                // create turf point
                let point = turf.point([newLatLng.lng, newLatLng.lat]);
                */

                let point = turf.point([parseFloat(trip.path[i][1]), parseFloat(trip.path[i][0])]);
                // point properties
                point.properties.keyword = trip.keywords[i];
                // videos
                point.properties.video = {
                    nameLeft: trip.videoLNames[i],
                    nameRight: trip.videoRNames[i],
                    timeLeft: trip.videoLTimes[i],
                    timeRight: trip.videoRTimes[i]
                }
                // leaflet points
                point.properties.time = trip.times[i];
                point.properties.loc = [parseFloat(trip.path[i][1]), parseFloat(trip.path[i][0])];
                point.properties.narrative = trip.narratives[i];
                point.properties.date = trip.date;
                point.properties.roadId = trip.roadids[i];
                point.properties.sentiment = trip.sentiments[i];
                point.properties.count = 1;
                sdps.push(point);
            }
        }
    });
    return sdps;
}

/**
 * all sdps point with narratives
 * @param {*} points turf points
 */
function mergeToHexGrid (points, cellWidth, options) {
    // map all point to square grid
    let collection = turf.featureCollection(points);
    // create bounding box
    let boundingBox = turf.bbox(collection);
    // create square grid
    let hexGrid = turfHexGrid(boundingBox, cellWidth, options);

    let cells = turfCollect(hexGrid, collection, 'keyword', 'keywords');
    cells = turfCollect(hexGrid, collection, 'narrative', 'narratives');
    cells = turfCollect(hexGrid, collection, 'date', 'dates');
    cells = turfCollect(hexGrid, collection, 'sentiment', 'sentiments');
    cells = turfCollect(hexGrid, collection, 'loc', 'locations');
    cells = turfCollect(hexGrid, collection, 'roadId', 'roadIds');
    cells = turfCollect(hexGrid, collection, 'count', 'total');
    cells = turfCollect(hexGrid, collection, 'video', 'videos');
    cells = turf.collect(hexGrid, collection, 'time', 'times');
    return cells;
}

/**
 * normalize total number of points for each grid
 * @param {*} grid 
 */
function normalizeCellPoints (grid) {
    let max = 0, index = 1;
    // count all points in cells
    grid.features.forEach( function (d) {
        // get sum of all count
        let sum = d.properties.total.reduce((a, b) => a + b, 0);
        // get max count for normalize
        if ( sum > max ) { max = sum; }
        d.properties.total = sum;
    });

    // normalize total count
    grid.features.forEach( (cell) => {
        cell.properties.index = index;
        cell.properties.total = normalize(cell.properties.total, [0, max], [0, 100]);
        ++index;
    });

    return grid;
}

// normalize count to percentage
function normalize (value, r1, r2) {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}