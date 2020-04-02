import timeToSeconds from './timeToSeconds';
/**
 * Check if current trip is continous
 * @param {*} trip1 
 * @param {*} trip2 
 */
export default function (trip1, trip2) 
{
    var seconds = timeToSeconds(trip2) - timeToSeconds(trip1);
    // Time different must be in 1 seconds
    return (seconds == 1) ? true : false;
}