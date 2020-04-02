/**
 * Create new trip object
 * @param {Number} index - trip index
 */
export default function (index) {
    return {
        index: index, id: null, date: null,
        _ids: [],
        times: [],
        path: [],
        narratives: [],
        roadids: [],
        speeds: [],
        videoLNames: [],
        videoRNames: [],
        videoLTimes: [],
        videoRTimes: [],
        keywords: [],
        sentiments: []
    }
}

/**
 * Add current point to specific trip
 * @param {*} trip 
 * @param {*} point 
 */
export function add (trip, point) {
    trip._ids.push(point._id)
    trip.times.push(point.time);
    trip.path.push(point.coord);
    trip.narratives.push(point.narrative);
    trip.roadids.push(point.rid);
    trip.speeds.push(point.speed);
    trip.videoLNames.push(point.videoLName);
    trip.videoRNames.push(point.videoRName);
    trip.videoLTimes.push(point.videoLTime);
    trip.videoRTimes.push(point.videoRTime);
    trip.keywords.push(point.keyword);
    trip.sentiments.push(point.sentiment);
    return trip;
}