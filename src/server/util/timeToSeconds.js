/**
 * Convert HH:MM:SS to seconds
 * @param {String} timeString 
 */
export default function (timeString) {
    let t = timeString.split(':');
    return (+t[0]) * 60 * 60 + (+t[1]) * 60 + (+t[2]);
}