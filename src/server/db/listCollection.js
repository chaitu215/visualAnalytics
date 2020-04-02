import mongodb from 'mongodb';

/**
 * List all collection by database name
 * @param {*} req 
 * @param {*} res 
 */
export default function (req, res)
{
    const mongoClient = mongodb.MongoClient;
    const url = 'mongodb://localhost:27017';
    // Database name
    const dbName = req.params.dbname;

    mongoClient.connect( url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        let dbo = db.db(dbName);
        // List all collections
        dbo.listCollections().toArray( function (err, collections) {
            if (err) throw err;
            let collectionNames = [];
            collections.forEach( function (collection) {
                collectionNames.push(collection.name);
            });
            // Send all collection names back to user
            res.send(collectionNames);
            // Close connection
            db.close();
        });
    });
}