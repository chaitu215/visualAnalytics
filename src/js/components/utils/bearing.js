/**
 * Calculate bearing of 2 consecutive points
 * @param {*} start 
 * @param {*} end 
 */
export default function (start, end)
{
    // Convert to geojson format
    var point1 = turf.point([start[1], start[0]]);
    var point2 = turf.point([end[1], end[0]]);

    // Calculate bearing
    var bearing = turf.bearing(point1, point2);
    return turf.bearingToAzimuth(bearing);
}