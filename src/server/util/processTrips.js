import {default as newTrip, add as addPointToTrip} from './trip';
import {default as newPoint} from './point';

export default function (data)
{
    let current, next, index = 1, trips = [];
    
    let trip = newTrip(index);

    let i = 0, len = data.length;
    console.log('Preprocess ' + len + ' items');

    while (i < len) {
        // Set current data
        current = data[i];

        if (current.tripid !== 1011416) {
            if (i != len - 1) {
                next = data[i + 1]
            } else {
                next = data[ (i + 1) % data.length];
            }
    
            let point_1 = newPoint(current),
                point_2 = newPoint(next);
    
            if (point_1.tid == point_2.tid) {
                trip = addPointToTrip(trip, point_1);
            } else {
                trip = addPointToTrip(trip, point_1);
                trip.id = point_1.tid;
    
                trip.date = point_1.date;
                trips.push(trip);
    
                index++;
        
                trip = newTrip(index);
            }
        }
        ++i;
    }

    return trips;
}