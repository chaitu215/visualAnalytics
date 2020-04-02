export let keywordCollections = [];

/**
 * Add keyword to collection
 * @param {*} keyword 
 */
export function addKeywords (keyword) {
    keywordCollections.push(keyword);
    return;
}

/**
 * Clear current keyword collection
 */
export function clearKeywords () {
    return keywordCollections = [];
}

/**
 * Get current keyword collection
 */
export function getKeywordCollections () {
    return keywordCollections;
}
