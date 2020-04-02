import { getImagePath, getStreetname} from '../../component';

/**
 * get parent point information
 * @param {*} index 
 * @param {*} trip 
 */
export default function (index, trip)
{

    return {
        trip: trip,
        pointIndex: index,
        date: trip.date,
        time: trip.times[index],
        keywords: trip.keywords[index],
        narrative: trip.narratives[index],
        latlng: trip.path[index],
        leftImg: getImagePath(trip.videoLNames[index], trip.videoLTimes[index]),
        rightImg: getImagePath(trip.videoRNames[index], trip.videoRTimes[index]),
        streetname: getStreetname(trip.roadids[index])
    };
    
}