export const MAX_TOP = 10;

// Preprocess keyword data
export function proccess_keyword_tree_data(keywords)
{
    let top_keywords = get_top_keywords(keywords, MAX_TOP);
    console.log(top_keywords);
}

// Get top keywords inside every regions
export function get_top_keywords(keywords, top)
{
    // Top keywords result
    let result = [];

    // Collect all keywords with its frequency
    keywords.forEach( (words) => {
        if (words.length !== 0) {

            // Iterate all over the word
            for (let i = 0; i < words.length; ++i) {

                // Finding word position in the array
                let word = words[i],
                    pos = result.map((x) => {
                        return x.word;
                    }).indexOf(word);

                // Word already exist
                if (pos !== -1) {
                    result[pos].frequnency++;
                } else {

                    // Create new object
                    let obj = {
                        keyword: word,
                        frequency: 1
                    }

                    // Store current object
                    result.push(obj);
                }
            }
        }
    });

    // Sort keywords by frequency (descending order)
    result.sort( (lhs, rhs) => {
        return rhs.frequency - lhs.frequency;
    });

    // Get only keywords within top
    return result.slice(0, top);
}