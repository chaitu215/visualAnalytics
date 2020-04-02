import { imageOptions } from './create';
import { getStreetname } from '../component';
import { getAllTrips, getCurrentLocationName } from '../../main/geovisuals';

/**
 * Get all data by keywords
 * @param {*} keywords 
 */
export default function (keywords) 
{
    // Data collections
    var data = [];
    // All trips data
    var trips = getAllTrips();

    trips.forEach ( trip => {
        // Check existing keywords and store it to collections
        for (var i = 0, len = trip.keywords.length; i < len; ++i) {
            if (hasKeywords(trip.keywords[i], keywords)) {
                var item = {
                    date: trip.date,
                    narrative: trip.narratives[i],
                    point: trip.path[i],
                    street: getStreetname(trip.roadids[i]),
                    videoLName: trip.videoLNames[i],
                    videoRName: trip.videoRNames[i],
                    videoLTime: trip.videoLTimes[i],
                    videoRTime: trip.videoRTimes[i]
                }
                data.push(getDataItem(item));
            }
        }
    });

    // Check existing keywords
    function hasKeywords (keywords, selectedKeywords) {
        return (selectedKeywords.some( 
            keyword => keywords.indexOf(keyword) === -1)
        ) ? false : true;
    }

    // Get data item
    function getDataItem (d) {
        return {
            date: d.date,
            street: d.street,
            imageLeft: getImagePath(d.videoLName, d.videoLTime),
            imageRight: getImagePath(d.videoRName, d.videoRTime),
            leftMask: getImageMask(d.videoLName, d.videoLTime),
            rightMask: getImageMask(d.videoRName, d.videoRTime),
            narratives: d.narrative,
            location: d.point,
        }
    }

    // Get image masks
    function getImageMask (videoname, videotime) {

        var location = getCurrentLocationName();
        var tripid = videoname.split('.')[0];
        var image = tripid + '-' + videotime + '.jpg';

        return location + '/images-masks/' + tripid + '/' + image;
    }

    // Get all image path
    function getImagePath (videoname, videotime) {
        
        let location = getCurrentLocationName();
        let tripid = videoname.split('.')[0];
        let image = tripid + '-' + videotime + '.jpg'

        return location + '/images/' + tripid + '/' + image;
        /*
        if (imageOptions.original) {
            return location + '/images/' + tripid + '/' + image;
        }

        if (imageOptions.custom) {
            return location + '/images-custom/' + tripid + '/' + image;
        }

        if (imageOptions.grayscale) {
            return location + '/images-grayscale/' + tripid + '/' + image;
        }
        
        return;*/
    }

    return data;
}

/*
export default function (keywords) {

    // Final data collection
    let data = [];
    let trips = getAllTrips();

    trips.forEach ( trip => {
        for (let i = 0, len = trip.keywords.length; i < len; ++i) {
            if (hasKeywords(trip.keywords[i], keywords)) {
                let item = {
                    date: trip.date,
                    narrative: trip.narratives[i],
                    point: trip.path[i],
                    street: getStreetname(trip.roadids[i]),
                    videoLName: trip.videoLNames[i],
                    videoRName: trip.videoRNames[i],
                    videoLTime: trip.videoLTimes[i],
                    videoRTime: trip.videoRTimes[i]
                }
                data.push(getDataItem(item));
            }
        }
    });

    // Check if keyword existed
    function hasKeywords (keywords, selectedKeywords) {
        return (selectedKeywords.some( 
            keyword => keywords.indexOf(keyword) === -1)
        ) ? false : true;
    }

    function getDataItem (d) {
        return {
            date: d.date,
            street: d.street,
            imageLeft: getImagePath(d.videoLName, d.videoLTime),
            imageRight: getImagePath(d.videoRName, d.videoRTime),
            narratives: d.narrative,
            location: d.point,
        }
    }

    function getImagePath (videoname, videotime) {
        
        let location = getCurrentLocationName();
        let tripid = videoname.split('.')[0];
        let image = tripid + '-' + videotime + '.jpg'

        if (imageOptions.original) {
            return location + '/images/' + tripid + '/' + image;
        }

        if (imageOptions.custom) {
            return location + '/images-custom/' + tripid + '/' + image;
        }

        if (imageOptions.grayscale) {
            return location + '/images-grayscale/' + tripid + '/' + image;
        }
        
        return;
    }

    return data;
}

*/