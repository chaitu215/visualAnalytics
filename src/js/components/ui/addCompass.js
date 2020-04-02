/**
 * Add compass on left and right container
 * @param {*} divLeft 
 * @param {*} divRight 
 * @param {*} angle 
 */
export default function (divLeft, divRight, angle)
{
    $('#videoLeft-compass').remove();
    $('#videoRight-compass').remove();

    var leftCompass = $('<div/>', {
        id: 'videoLeft-compass'
    }).css({
       position: 'absolute',
       top: '15px',
       left: '15px',
       color: '#d6604d',
       'font-weight': 'bold'
    });

    var rightCompass = $('<div/>', {
        id: 'videoRight-compass'
    }).css({
        position: 'absolute',
        top: '15px',
        right: '15px',
        color: '#4393c3',
        'font-weight': 'bold'
    });

    var leftAngle = 'none', rightAngle = 'none';

    let direction = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'][Math.round(angle / 11.25 / 2)];

    if (direction == 'N') {
        leftAngle = "W";
        rightAngle = "E";
    } else if (direction == 'NNE' || direction == "NE" || direction == "ENE") {
        leftAngle = "NW";
        rightAngle = "SE";
    } else if (direction == 'E') {
        leftAngle = "N";
        rightAngle = "S";
    } else if (direction == "ESE" || direction == "SE" || direction == "SSE") {
        leftAngle = "NE";
        rightAngle = "SW";
    } else if (direction == "S") {
        leftAngle = "E";
        rightAngle = "W";
    } else if (direction == "SSW" || direction == "SW" || direction == "WSW") {
        leftAngle = "SE";
        rightAngle = "NW";
    } else if (direction == "W") {
        leftAngle = "S";
        rightAngle = "N";
    } else if (direction == "WNW" || direction == "NW" || direction == "NNW") {
        leftAngle = "SW";
        rightAngle = "NE";
    }

    leftCompass.append(leftAngle);
    rightCompass.append(rightAngle);

    divLeft.append(leftCompass);
    divRight.append(rightCompass);

    return;
}