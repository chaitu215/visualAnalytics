import mongodb from 'mongodb';
import processStreets from '../util/processStreets';

/**
 * Get all streets data from specific collection
 * @param {*} req 
 * @param {*} res 
 */
export default function (req, res)
{
    const mongoClient = mongodb.MongoClient;
    const url = 'mongodb://localhost:27017';
    // Database and collection names
    let dbName = req.params.dbname;
    let collectionName = req.params.colName;

    mongoClient.connect( url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        
        let dbo = db.db(dbName);
        dbo.collection(collectionName).find().toArray(function (err, items) {
            if (err) throw err;
            // Process street data
            let data = processStreets(items);
            // Send preprocessed streets back to user
            res.send(data);
            db.close();
        });
    });
}