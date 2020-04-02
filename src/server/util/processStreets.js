/**
 * Preprocessing streets data
 * @param {*} segments - street segments
 */
export default function (segments) {
    var streets = [],
        lineSegments = [],
        roadSegments = [];

    for (var i = 0, len = segments.length; i < len; i++) {

        var name = segments[i].name,
            highway = segments[i].highway,
            linestring = segments[i].geometry.coordinates,
            roadid = segments[i].osm_id;

        if (name != 'none') {
            // Find any duplicate street name
            var pos = streets.map(function(x) {
                return x.name;
            }).indexOf(name);

            if (pos == -1) {

                lineSegments = [], roadSegments = [];
                lineSegments.push(linestring); roadSegments.push(roadid);

                // Street data structure
                var street = {
                    name: name,
                    type: highway,
                    segments: lineSegments,
                    ids: roadSegments
                }
                streets.push(street);

            } else {
                streets[pos].segments.push(linestring);
                streets[pos].ids.push(roadid);
            }
        }
    }

    return streets;
}