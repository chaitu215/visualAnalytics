import Sentiment from 'sentiment';
import { default as getKeywords } from '../util/keywords';

var startTime = "";
var endTime = "";

export default function(data, index, id, date) {

    var sentiment = new Sentiment();
    var result = {
        index: index,
        id: id,
        date: formatDate(date),
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
    };

    var tmpTimeGap = 0;

    for (var i = 0; i < data.length; ++i) {
        var narrative = (data[i]['Sentence'] !== "") ? data[i]['Sentence'] : 'none';
        var sentimentScore = sentiment.analyze(data[i]['Sentence']).score;
        var keywords = getKeywords(data[i]['Sentence']);
        var lng = parseFloat(data[i]['Longitude']);
        var lat = parseFloat(data[i]['Latitude']);

        var time = removeSquareBlanket(data[i]['timestamp']);
        result.speeds.push(0)
        result.videoLNames.push(id + '-L.MOV');
        result.videoRNames.push(id + '-R.MOV');

        // Need to fix this
        //var startTime = removeSquareBlanket(data[0]['timestamp']);
        //var videoLTime = getVideoTime(id, i, startTime, time, 'left');
        //var videoRTime = getVideoTime(id, i, startTime, time, 'right');

        //result.videoLTimes.push(videoLTime);
        //result.videoRTimes.push(videoRTime);

        result.videoLTimes.push(i);
        result.videoRTimes.push(i);

        result._ids.push(i);
        result.roadids.push('0');
        result.narratives.push(narrative);
        result.sentiments.push(sentimentScore);
        result.keywords.push(keywords);
        result.path.push([lat, lng]);
        result.times.push(time);
    }


    return result;
}

function getVideoTime(id, index, startTime, gpsTime, angle) {

    if (id === '02-06-15') {
        let lTime = hmsToSeconds('00:05:01');
        let rTime = hmsToSeconds('00:02:45');
        let timeRange = hmsToSeconds(gpsTime) - hmsToSeconds(startTime);
        if (angle === 'left') {
            return lTime + timeRange;
        } else {
            return rTime + timeRange;
        }
    } else if (id === '02-11-14') {
        let lTime = hmsToSeconds('00:08:40');
        let rTime = hmsToSeconds('00:00:00');
        let timeRange = hmsToSeconds(gpsTime) - hmsToSeconds(startTime);
        if (angle === 'left') {
            return lTime + timeRange;
        } else {
            return rTime + timeRange;
        }
    } else if (id === '03-02-15') {
        let lTime = hmsToSeconds('00:01:05');
        let rTime = hmsToSeconds('00:01:05');
        let timeRange = hmsToSeconds(gpsTime) - hmsToSeconds(startTime);
        if (angle === 'left') {
            return lTime + timeRange;
        } else {
            return rTime + timeRange;
        }
    } else if (id === '05-15-15') {
        let lTime = hmsToSeconds('00:11:58');
        let rTime = hmsToSeconds('00:12:10');
        let timeRange = hmsToSeconds(gpsTime) - hmsToSeconds(startTime);
        if (angle === 'left') {
            return lTime + timeRange;
        } else {
            return rTime + timeRange;
        }
    }
    return;
}

function hmsToSeconds(hms) {
    var a = hms.split(':'); // split it at the colons
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
    return seconds;
}

function removeSquareBlanket(str) 
{
    str = str.replace('[', '');
    str = str.replace(']', '');
    return str;
}

function formatDate(dateStr) {
    var arr = dateStr.split('-');
    var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

    var month_index = parseInt(arr[0], 10) - 1;
    return months[month_index] + " " + arr[2];
}