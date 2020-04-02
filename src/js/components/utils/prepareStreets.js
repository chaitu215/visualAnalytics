import getStreetname from './getStreetname';
import getStreetpath from './getStreetPath';

export var street_total_points = [0, 0, 0, 0, 0];

export default function (trips, streets) {
    
    // Reset street total points values
    street_total_points = [0, 0, 0, 0, 0];

    let data = [];
    let streetIndex = 0;
    trips.forEach(function (trip) {

        let narratives = trip.narratives;
        let roadids = trip.roadids;
        let keywords = trip.keywords;
        let path = trip.path;
        let sentiments = trip.sentiments;
        let times = trip.times;
        let vlnames = trip.videoLNames;
        let vrnames = trip.videoRNames;
        let vltimes = trip.videoLTimes;
        let vrtimes = trip.videoRTimes;

        for (let i = 0, len = narratives.length; i < len; ++i) {
            if (narratives[i] !== 'none') {

                let streetname = getStreetname(roadids[i]);

                if (streetname) {

                    // Find if streetname already exists?
                    let pos = data.map(function (x) {
                        return x.name;
                    }).indexOf(streetname);

                    if (pos == -1) {
                        
                        let street = {
                            index: streetIndex + 1,
                            name: streetname,
                            tripIds: [],
                            dates: [],
                            narratives: [],
                            keywords: [],
                            points: [],
                            sentiments: [],
                            path: getStreetpath(streetname, streets),
                            times: [],
                            videoLNames: [],
                            videoRNames: [],
                            videoLTimes: [],
                            videoRTimes: [],
                        }

                        street.tripIds.push(trip.id);
                        street.dates.push(trip.date);
                        street.narratives.push(narratives[i]);
                        street.keywords.push(keywords[i]);
                        street.points.push(path[i]);
                        street.sentiments.push(sentiments[i]);
                        street.times.push(times[i]);
                        street.videoLNames.push(vlnames[i]);
                        street.videoRNames.push(vrnames[i]);
                        street.videoLTimes.push(vltimes[i]);
                        street.videoRTimes.push(vrtimes[i]);

                        data.push(street);
                        streetIndex++;
                    } else {

                        data[pos].tripIds.push(trip.id);
                        data[pos].dates.push(trip.date);
                        data[pos].narratives.push(narratives[i]);
                        data[pos].keywords.push(keywords[i]);
                        data[pos].points.push(path[i]);
                        data[pos].sentiments.push(sentiments[i]);
                        data[pos].times.push(times[i]);
                        data[pos].videoLNames.push(vlnames[i]);
                        data[pos].videoRNames.push(vrnames[i]);
                        data[pos].videoLTimes.push(vltimes[i]);
                        data[pos].videoRTimes.push(vrtimes[i]);
                    }
                }
            }
        }
    });
    
    //console.log(data);
    addStreetColor(data);
    return data;
}

/**
 * Add street color by normalization
 */
function addStreetColor (streets) {

    // Normalize
    function normalize (value, r1, r2) {
        return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
    }

    // Calculate min and max point count
    let min = d3.min(streets, d => d.points.length);
    let max = d3.max(streets, d => d.points.length);
    streets.forEach( street => {
        var score = normalize(street.points.length, [min, max], [0, 100]);
        street.color = getStreetColor(score);
        // Store max value into each ranges
        add_Total_Points(score, street.points.length);
    });
    
    return;
}

function getStreetColor (d) {
    /*
    return  d > 80  ? '#800026' :
            d > 70  ? '#bd0026' :
            d > 55  ? '#e31a1c' :
            d > 35  ? '#fc4e2a' :
            d > 25  ? '#fd8d3c' :
            d > 15  ? '#feb24c' :
            d > 5   ? '#fed976' : '#ffeda0';*/

    return  d >= 90  ? '#bd0026' :
            d >= 70  ? '#f03b20' :
            d >= 50  ? '#fd8d3c' :
            d >= 30  ? '#feb24c' : '#fed976';
}

// Add street points to total values
// This used for map
function add_Total_Points(score, length)
{
    if (score >= 90) {
        if (length > street_total_points[0]) {
            street_total_points[0] = length;
        }
        return;
    } else if (score >= 70) {
        if (length > street_total_points[1]) {
            street_total_points[1] = length;
        }
        return;
    } else if (score >= 50) {
        if (length > street_total_points[2]) {
            street_total_points[2] = length;
        }
        return;
    } else if (score >= 30) {
        if (length > street_total_points[3]) {
            street_total_points[3] = length;
        }
        return;
    } else {
        if (length > street_total_points[4]) {
            street_total_points[4] = length;
        }
        return;
    }
}