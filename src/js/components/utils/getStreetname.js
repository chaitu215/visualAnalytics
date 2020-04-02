import {getCurrentStreets} from '../../main/geovisuals';
export default function (rid) {
    let streets = getCurrentStreets();
    for (let i = 0, len = streets.length; i < len; ++i) {
        let street = streets[i];
        let name = street.name,
            ids = street.ids;
        if (ids.indexOf(rid) !== -1) {
            return name;
        }
    }
    return;
}