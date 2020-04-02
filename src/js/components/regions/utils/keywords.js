/**
 * Find top keywords
 * @param {*} keywords 
 * @param {*} top 
 */
export default function (keywords, top) {
    let result = [];
    keywords.forEach(words => {
        words.forEach( word => {
            // Find position of current word
            let pos  = result.map(function (x) {
                return x.keyword;
            }).indexOf(word);
            // Check position and adding frequency value if 
            // duplicate is found
            (pos !== -1) ? result[pos].frequency += 1 :
                    result.push(getNewKeyword(word));
        });
    });

    result = sortByFrequency(result);
    // Return top keywords by specific value
    return result.slice(0, top);
}
/**
 * Create new keyword object
 * @param {*} word 
 */
function getNewKeyword (word) {
    return {
        keyword: word,
        frequency: 1
    };
}

/**
 * Sort keywords value descending
 * @param {*} keywords 
 */
function sortByFrequency (keywords) {
    return keywords.sort((a, b) => {
        return b.frequency - a.frequency;
    });
}