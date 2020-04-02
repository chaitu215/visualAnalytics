/**
 * Fix time format to HH:MM:SS
 * @param {*} t 
 */
export default function (t) {

    if (t == 'none') return '00:00:00';

    let time = t.split(':');
    let hours = '00',
        minutes = '00',
        seconds = '00';

    // check time format length
    if (time.length > 2) {
        hours = time[0]; minutes = time[1]; seconds = time[2].split('.')[0];
    } else {
        hours = '00'; minutes = time[0]; seconds = time[1].split('.')[0];
    }

    return hours + ':' + minutes + ':' + seconds;
    
}