// Sentiment option
export default option = {
    extras: {}
}

// empty sentiment options
export var option = {
    extras: {

    }
};

//
export default function () {
    
}

/**
 * Add modified sentiment score if
 * keyword is not existed in current options
 * @param {string} keyword - object key
 * @param {integer} score - between -5 to 5 
 */
export function add (keyword, score) {
    return option.extras[keyword] = parseInt(score);
}

/**
 * Remove keyword from sentiment options
 * if its existed
 * @param {string} keyword - object key 
 */
export function remove (keyword) {
    if (keyword in option.extras) {
        delete option.extras[keyword];
    }
    return;
}

/**
 * Reset all added keywords and sentiment options
 */
export function reset () {
    return option = { extras: {} };
}