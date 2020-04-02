/**
 * Create car marker as video marker
 * @param {*} point - [latitude, longitude] values
 */
export default function (point, bearing) {
    
    // Create car icon
    var carIcon = L.icon({
        iconUrl: "./images/marker/car.png",
        iconSize: [40, 40],
        className: 'rotate-north'
    });

    /*
    carIcon._icon.style.WebkitTransform = carIcon._icon.style.WebkitTransform + ' rotate(' + marker.options.iconAngle + 'deg)';
    carIcon._icon.style.MozTransform = 'rotate(' + carIcon.options.iconAngle + 'deg)';*/

    // Create leaflet marker
    var marker = new L.marker(point, {
        id: 'video-marker',
        className: 'test',
        icon: carIcon,
        rotationAngle: bearing,
        rotationOrigin: 'center'
    });

    return marker;
}