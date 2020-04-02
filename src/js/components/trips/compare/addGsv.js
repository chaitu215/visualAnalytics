export default function (point)
{
    let googleServices = new google.maps.StreetViewService();
    let panorama = new google.maps.StreetViewPanorama(
        document.getElementById('compare-gsv'), {
            position: {lat: point[0], lng: point[1]},
            pov: {
                heading:  34,
                pitch: 5
            }
    });

    // Text
    $('.googletext').empty();
    googleServices.getPanorama({ 
        location: { 
                lat: point[0],
                lng: point[1],
            },
            radius: 50
        }, function (data, status) {
            var text = document.createElement('div');
            text.className = 'googletext';
            text.innerHTML = 'Date: ' + data.imageDate;
            text.style.position = 'absolute';
            text.style.zIndex = '2000';
            text.style.top = '20px';
            text.style.left = '50%';
            text.style.fontSize = '1em';
            text.style.color = '#fff';
        document.getElementById('compare-gsv').appendChild(text);
    });

    let options = {
        scrollwheel: true,
        disableDefaultUI: false,
        clickToGo: true
    }

    google.maps.event.trigger(panorama, 'resize');
    panorama.setOptions(options);
    return;
}