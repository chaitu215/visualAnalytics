export default function(trips, streets)
{
    console.log(trips)
    for (var i = 0; i < trips.length; ++i) {
        var trip = trips[i];
        var roadIds = [];
        for (var j = 0; j < trip.path.length; ++j) {
            var roadId = findNearestStreetSegment(trip.path[j],streets);
            roadIds.push(roadId);
        }
        trip.roadids = roadIds;
    }

    var streets = processStreets(streets);

    var data = {
        index: 1,
        name: "sample",
        trips: trips,
        streets: streets,
        segnets: []
    }
    return data;
}

function findNearestStreetSegment(point, streets) {

    var minDistance = undefined;
    var roadid = undefined;

    for (var i = 0; i < streets.length; ++i) {
        var pt = turf.point([parseFloat(point[1]), parseFloat(point[0])]);
        var line = turf.lineString(streets[i]['geometry']['coordinates']);

        var distance = turf.pointToLineDistance(pt, line, { units: 'miles' });
        
        if (minDistance) {
            if (distance < minDistance) {
                roadid = streets[i]['osm_id'];
                minDistance = distance;
            }
        } else {
            minDistance = distance;
        }
    }

    return roadid;
}

function processStreets(streets) 
{
    let result = [];

    for (var i = 0; i < streets.length; ++i) {
        var type = streets[i]['highway'];
        var name = streets[i]['name'];
        var rid = streets[i]['osm_id'];
        
        var pos = result.map(function(x) {
            return x.name;
        }).indexOf(name);

        // Create segment
        var segment = [];
        streets[i]['geometry']['coordinates'].forEach(function(coord) {
            segment.push([coord[0], coord[1]]);
        });

        //console.log(segment);

        if (pos === -1) {

            let street = {
                name: name,
                type: type,
                segments: [],
                ids: []
            }
            street['segments'].push(segment);
            street['ids'].push(rid);
            result.push(street);

        } else {
            result[pos]['segments'].push(segment);
            result[pos]['ids'].push(rid);
        }
    }

    return result;
}