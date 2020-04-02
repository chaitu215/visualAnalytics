import { default as normalize } from '../utils/normalize';

/**
 * Generate sentiment for stacked bar chart
 * @param {*} streets 
 */
export default function (streets) {
    let data = [];
    streets.forEach( street => {
        // This will a series to be stacked
        let name = street.name;
        for (var i = 0, len = street.sentiments.length; i < len; ++i) {
            
            let score = street.sentiments[i];
            let date = street.dates[i];

            let pos = data.map( function (x) {
                return x.date
            }).indexOf(date);

            // Check existing date and fill the score in it
            if (pos !== -1) {
                if (_.has( data[pos], name)) {
                    data[pos][name] += score;
                } else {
                    data[pos][name] = score;
                }
            } else {
                // Create new data item
                let item = createNewItem(date, score, name);
                // Add item to dataset
                data.push(item);
            }

        }
    });
    // All preprocessing steps
    data = fillOutAllSeries(data);
    //data = normalizeSentiment(data);
    return data;
}

/**
 * Create new item object
 * @param {*} date 
 * @param {*} sentiment 
 * @param {*} name 
 */
function createNewItem (date, sentiment, name) {
    let item = {
        date: date
    }
    item[name] = sentiment;
    return item;
}

/**
 * Fill out all series
 * @param {*} data 
 */
function fillOutAllSeries (data) {
    var defaultObj = data.reduce((m, o) => (Object.keys(o).forEach(key => m[key] = 0), m), {});
    data = data.map(e => Object.assign({}, defaultObj, e));
    return data;
}

/**
 * Normalize sentiment data range = [-1,1]
 * @param {*} data 
 */
function normalizeSentiment (data) {
    var min = Infinity, max = 0;
    // Finding minimum and maximum values
    data.forEach( item => {
        for (var key in item) {
            // If properties is not date
            if (key !== 'date') {
                if (item[key] < min) { min = item[key]; }
                if (item[key] > max) { max = item[key]; }
            }
        }
    });
    // Loop through all value and normalize it
    data.forEach( item => {
        for (var key in item) {
            if (key !== 'date') {
                item[key] = normalize(item[key], [min, max], [-1, 1]);
            }
        }
    });
    return data;
}