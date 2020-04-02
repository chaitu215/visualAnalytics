import {dom, prepareKeywords, drawWordcloud} from '../component';
/**
 * Add wordcloud to current trip
 */
export default function (keywords) {
    // Clear current video keywords
    $('#trip-detail-narrative').empty();
    // Prepare all keywords for display wordcloud
    let preparedKeywords = prepareKeywords(keywords);
    // Display current wordcloud
    drawWordcloud($('#trip-detail-narrative'), preparedKeywords, '#000');
    return;
}