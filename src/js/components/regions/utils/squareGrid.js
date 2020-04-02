/**
 * compute square grid with turf.js
 * @param {*} trips all trips
 * @param {*} cellWidth cell distance 
 * @param {*} options distance units
 */
export default function (trips, cellWidth, options) {

    // get all point with narratives (sdps)
    let points = getTurfPoints(trips);
    // merge all points to grid cell
    let cells = mergeToSquareGrid(points, cellWidth, options);
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
                // create turf point
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
function mergeToSquareGrid (points, cellWidth, options) {
    // map all point to square grid
    let collection = turf.featureCollection(points);
    // create bounding box
    let boundingBox = turf.bbox(collection);
    // create square grid
    let squareGrid = turf.squareGrid(boundingBox, cellWidth, options);

    // merge collection into square grid (important)
    let cells = turf.collect(squareGrid, collection, 'keyword', 'keywords');
    cells = turf.collect(squareGrid, collection, 'narrative', 'narratives');
    cells = turf.collect(squareGrid, collection, 'date', 'dates');
    cells = turf.collect(squareGrid, collection, 'sentiment', 'sentiments');
    cells = turf.collect(squareGrid, collection, 'loc', 'locations');
    cells = turf.collect(squareGrid, collection, 'roadId', 'roadIds');
    cells = turf.collect(squareGrid, collection, 'count', 'total');
    cells = turf.collect(squareGrid, collection, 'video', 'videos');
    cells = turf.collect(squareGrid, collection, 'time', 'times');
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