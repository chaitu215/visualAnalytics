import express from 'express';
import Fs from 'fs';
import path from 'path';
import {default as csv} from 'csv-parser';

import listCollection from '../db/listCollection';
import getAllTrips from '../db/getAllTrips';
import getAllStreets from '../db/getAllStreets';
import { default as videoStreaming } from '../media/video';
import { default as preprocess } from '../newData/preprocess';

const router = express.Router();

// DB query
// List all collections
router.route('/listCollection/:dbname').get(listCollection);
// List all trips
router.route('/getAllTrips/:dbname/:colName').get(getAllTrips);
// List all streets
router.route('/getAllStreets/:dbname/:colName').get(getAllStreets);
// Streaming video by source files
router.route('/video/:loc,:tripid,:filename').get(videoStreaming);

function processNewData(filePath, index, id) {
    return new Promise(function(resolve, reject) {
        var result = [];
        Fs.createReadStream(filePath)
            .pipe(csv())
            .on('error', (err) => reject(err))
            .on('data', (data) => result.push(data))
            .on('end', () => resolve(preprocess(result, index, id, id)));
    });
}

// Get new datasets
router.route('/getNewData/').get(function(req, res) {

    var newDataPath = path.join('asset', 'sample', 'data');

    Fs.readdir(newDataPath, function(error, files) {
        if (error) throw error;

        var newData = [];
        var index = 1;
        files.forEach(function(fileName) {
            let id = fileName.split('.')[0];
            newData.push(processNewData(path.join(newDataPath,fileName), index, id));
            index++;
        });

        Promise.all(newData)
            .then((result) => {
                res.send(result);
            })
            .catch((e) => { throw e; })
    });
});

router.route('/getNewStreets/').get(function(req, res) {
    var streetFile = path.join('asset', 'sample', 'streets', 'akron-streets.json');

    Fs.readFile(streetFile, 'utf8', function(error, data) {
        if (error) throw error;
        res.send(JSON.parse(data));
    });
});

// Export global router
export default router;