import {getCurrentLocationName} from '../../main/geovisuals';
/**
 * Get image path
 * @param {*} videoname - video name
 * @param {*} videotime - video time (seconds)
 */
export default function (videoname, videotime) {
    // Get Location name
    let location = getCurrentLocationName();
    // Trip id
    let tripid = videoname.split('.')[0];
    let image = tripid + '-' + videotime + '.jpg';
    return location + '/images/' + tripid + '/' + image;
}