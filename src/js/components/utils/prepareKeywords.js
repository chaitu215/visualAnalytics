export default function (keywords) {
    var result = {};
    // Create keywords object with frequency.
    for (var i = 0; i < keywords.length; i++) {
        var words = keywords[i];
        for (var j = 0; j < words.length; j++) {
            // Check if words already existed in result object.
            if (result.hasOwnProperty(words[j])) {
                result[words[j]]++;
            } else {
                // Create new word with initialize value.
                result[words[j]] = 1;
            }
        }
    }

    // Sorted keywords by frequency and normalize it
    result = getSortedByValue(result);
    result = normalize(result);

    var pairs = Object.keys(result).map(function (key) {
        return [key, result[key]];
    });

    pairs.sort(function (a, b) {
        return a[1] - b[1];
    });

    result = pairs.slice(-30).reduce(function (obj, pair) {
        obj[pair[0]] = pair[1];
        return obj;
    }, {});

    return result;
}

// Sort object with arrays are return a new objects
function getSortedByValue(obj) {
    var sortable = [];
    // Put item in sortable array.
    for (var item in obj) {
        sortable.push([item, obj[item]]);
    }
    // Sort value by decreasing.
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });

    obj = {};
    for (var i = 0, len = sortable.length; i < len; i++) {
        obj[sortable[i][0]] = sortable[i][1];
    }

    return obj;
}


// Normalize
function normalize(obj) {
    // Find min max
    var min = obj[Object.keys(obj)[Object.keys(obj).length-1]];
    var max = obj[Object.keys(obj)[0]];

    if (min == max || Object.keys(obj).length <= 1) {
        for (var item in obj) {
            obj[item] = 14;
        }
        return obj;
    } else {
        // Normalize function
        var norm = function(value, r1, r2) {
            return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
        };
        // Text size between 8 to 36
        for (var item in obj) {
            obj[item] = norm(obj[item], [min, max], [10,36]);
        }
        return obj;
    }
}