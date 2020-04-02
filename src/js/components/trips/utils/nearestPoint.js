/**
 * Get the nearest point on the trajectories
 * @param {*} point 
 * @param {*} trajectory 
 */
export default function (point, trajectory) {
    let nearest = turf.nearestPointOnLine(trajectory, point, {units: 'miles'});
    return nearest;
}