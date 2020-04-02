import isAlongPath from './isAlongPath';
import {default as newTrip, add as addPointToTrip} from './trip';
import {default as newPoint} from './point';


export default function (data) 
{
    let current, next;
    let index = 1, trips = [];

    // Initialize first trip
    let trip = newTrip(index);

    var i = 0, p1, p2;

    while (i < data.length) {

        // Set current and next point
        current = data[i];
        next = data[i + 1];
  
        if (next != undefined) {

            // Create new point
            p1 = newPoint(current);
            p2 = newPoint(next);
    
            if (p1.tid == p2.tid && isAlongPath(p1.time, p2.time)) {

                trip = addPointToTrip(trip, p1);
            } else {
                trip = addPointToTrip(trip, p1);
                trip.id = p1.tid;
                trip.date = p1.date;
                // need to be more than one seconds
                if (trip.path.length > 1) {
                    trips.push(trip);
                }
                index++;
                
                trip = newTrip(index, color);
            }
    
        } else {
            next = data[i - 1];
            p1 = newPoint(current);
            p2 = newPoint(next);
    
            if (p1.tid == p2.tid && isAlongPath(p2.time, p1.time)) {
                trip = addPointToTrip(trip, p1);
                trip.id = p1.tid;
                trip.date = p1.date;
                trips.push(trip);
                index++;

                trip = newTrip(index, color);
            }
        }

        i++;
    }
    return trips;
}