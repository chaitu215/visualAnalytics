import { getCurrentTrip, getAllTrips} from "../../../main/geovisuals";
import {default as getPointDetails } from './getPoint';
import {currentPointIndex} from '../../video/init';
import { default as setToggleMap } from './ui/toggleMap';
import { default as setSdps } from './ui/showSdps';

export default function ()
{
    // Hide google street view
    $('#compare-gsv').hide();
    // enable comparison modal
    $("#compare-modal").modal();
    setToggleMap();

    var trips = getAllTrips();
    var trip = getCurrentTrip();
    var index = currentPointIndex;

    var parent = getPointDetails(index, trip);
    var childs = [];
    
    trips.forEach( t => {
        if (t.index !== trip.index) {
            // find nearest index
            var path = getTurfLineString(t.path);
            // set parent location
            var parentLoc = turf.point([parent.latlng[1], parent.latlng[0]]);
            var nearestPoint = turf.nearestPointOnLine(path, parentLoc, {
                units: 'miles'
            });

            var index = nearestPoint.properties.index;
            var childLoc = turf.point([t.path[index][1], t.path[index][0]]);
            var options = {units: 'miles'};

            var distance = turf.distance(parentLoc, childLoc, options);
            //console.log(distance);

            if (distance < 0.05) {
                var child = getPointDetails(index, t);
                childs.push(child);
            }

        }
    });

    setSdps(parent, childs);
    return;
}

/**
 * Get line string in turf format
 * @param {*} polyline 
 */
function getTurfLineString (polyline) 
{
    var geoLine = [];
    for (var i = 0; i < polyline.length; ++i) {
        var point = [polyline[i][1], polyline[i][0]];
        geoLine.push(point);
    }

    return turf.lineString(geoLine);
}
