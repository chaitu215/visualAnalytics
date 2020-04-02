/**
 * Get sentiment color by sentiment score
 * @param {Number} score - sentiment score
 */
export default function (score) 
{
    switch (score) {
        case -5: return '#d73027';
        case -4: return '#f46d43';
        case -3: return '#fdae61';
        case -2: return '#fee08b';
        case -1: return '#ffffbf';
        case 0: return '#ffffff';
        case 1: return '#d9ef8b';
        case 2: return '#a6d96a';
        case 3: return '#66bd63';
        case 4: return '#1a9850'; 
        case 5: return '#1b7837';
        default: return '#ffffff';
    }
}