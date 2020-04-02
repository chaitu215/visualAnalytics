/**
 * Find top keywords
 * @param {*} keywords 
 * @param {*} top 
 */
export default function (keywords, top) {
    
    var keyword_collections = [];

    var count = 0;

    keywords.forEach( keyword => {
        if (keyword.length > 0) {
            keyword.forEach(word => {
                
                let pos = keyword_collections.map( (x) => {
                    return x.keyword;
                }).indexOf(word);

                if (pos === -1) {
                    keyword_collections.push(getNewKeyword(word));
                } else {
                    keyword_collections[pos].frequency += 1;
                }
            });
        }
    });

    var result = sortByFrequency(keyword_collections);
    // Return top keywords by specific value
    return result.slice(0, top);
}
/**
 * Create new keyword object
 * @param {*} word 
 */
// Have problem assigning value to the object
function getNewKeyword (word) {
    let item = {
        keyword: word
    };

    item.frequency = parseInt(1);
    return item;
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