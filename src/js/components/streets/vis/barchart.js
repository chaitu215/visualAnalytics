import {dom} from '../../component';
import { default as getSentimentSeries } from '../utils/sentiment';

export default function (streets) {
    console.log("--------------------------------")
    console.log("------inside bar chart ---------")
    // Empty sentiment chart
    dom.sentimentChart.empty();
    // Preprocess sentiment series data
    streets = getSentimentSeries(streets);
    drawBarchart(dom.sentimentChart, streets);
    return;
}

function drawBarchart (container, data) {
    data = sortByKeys(data);
    console.log("bar data",data);

    return;
}

function sortByKeys (data) {

    let sortedData = [];
    data.forEach (item => {
        const ordered = {};
        Object.keys(item).sort().forEach( function(key) {
            ordered[key] = item[key];
        });
        sortedData.push(ordered);
    });
    return sortedData;
}