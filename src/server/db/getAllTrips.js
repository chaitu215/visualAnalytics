import mongodb from 'mongodb';
import processTrips from '../util/processTrips';
/**
 * Get all trips data from specific collections
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
        let sortByTid = { tripid: 1, pdatetime: 1};
        // Create sort indexing
        dbo.collection(collectionName).createIndex(sortByTid);
        // Find all trips data and sort it
        dbo.collection(collectionName).find().sort(sortByTid).toArray( function (err, items) {
            if (err) throw err;
            let data = processTrips(items);
            // Send preprocessed trips to user
            res.send(data); 
            db.close();
        });
    });
}