import keywords from './keywords';
import sentiment from './sentiment';
import timeToSeconds from './timeToSeconds';
import fixTimeFormat from './fixTimeFormat';

/**
 * Initialize point object
 * @param {*} point 
 */
export default function (point) {

    let videoLTime = 0,
        videoRTime = 0;

    // need more preprocessing here!
    if (typeof point.media_time_left != 'number') {
        videoLTime = timeToSeconds( fixTimeFormat(point.media_time_left));
        videoRTime = timeToSeconds( fixTimeFormat(point.media_time_right));
    } else {
        videoLTime = point.media_time_left;
        videoRTime = point.media_time_right;
    }

    let pointObject = {
        tid: point.tripid,
        _id: point._id,
        date: point.pdatetime.split(' ')[0],
        time: point.pdatetime.split(' ')[1],
        coord: [point.lat, point.lng],
        narrative: point.narrative,
        rid: point.rid,
        speed: point.speed,
        videoLName: point.media_name_left,
        videoRName: point.media_name_right,
        videoLTime: videoLTime,
        videoRTime: videoRTime,
        keyword: keywords(point.narrative),
        sentiment: sentiment(point.narrative)
    }

    return pointObject;
}