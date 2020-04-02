/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/server/server-dev.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/server/db/getAllStreets.js":
/*!****************************************!*\
  !*** ./src/server/db/getAllStreets.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongodb */ \"mongodb\");\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _util_processStreets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/processStreets */ \"./src/server/util/processStreets.js\");\n\n\n\n/**\n * Get all streets data from specific collection\n * @param {*} req \n * @param {*} res \n */\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (req, res) {\n    const mongoClient = mongodb__WEBPACK_IMPORTED_MODULE_0___default.a.MongoClient;\n    const url = 'mongodb://localhost:27017';\n    // Database and collection names\n    let dbName = req.params.dbname;\n    let collectionName = req.params.colName;\n\n    mongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {\n        if (err) throw err;\n\n        let dbo = db.db(dbName);\n        dbo.collection(collectionName).find().toArray(function (err, items) {\n            if (err) throw err;\n            // Process street data\n            let data = Object(_util_processStreets__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(items);\n            // Send preprocessed streets back to user\n            res.send(data);\n            db.close();\n        });\n    });\n});\n\n//# sourceURL=webpack:///./src/server/db/getAllStreets.js?");

/***/ }),

/***/ "./src/server/db/getAllTrips.js":
/*!**************************************!*\
  !*** ./src/server/db/getAllTrips.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongodb */ \"mongodb\");\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _util_processTrips__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/processTrips */ \"./src/server/util/processTrips.js\");\n\n\n/**\n * Get all trips data from specific collections\n * @param {*} req \n * @param {*} res \n */\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (req, res) {\n    const mongoClient = mongodb__WEBPACK_IMPORTED_MODULE_0___default.a.MongoClient;\n    const url = 'mongodb://localhost:27017';\n    // Database and collection names\n    let dbName = req.params.dbname;\n    let collectionName = req.params.colName;\n\n    mongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {\n        if (err) throw err;\n\n        let dbo = db.db(dbName);\n        let sortByTid = { tripid: 1, pdatetime: 1 };\n        // Create sort indexing\n        dbo.collection(collectionName).createIndex(sortByTid);\n        // Find all trips data and sort it\n        dbo.collection(collectionName).find().sort(sortByTid).toArray(function (err, items) {\n            if (err) throw err;\n            let data = Object(_util_processTrips__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(items);\n            // Send preprocessed trips to user\n            res.send(data);\n            db.close();\n        });\n    });\n});\n\n//# sourceURL=webpack:///./src/server/db/getAllTrips.js?");

/***/ }),

/***/ "./src/server/db/listCollection.js":
/*!*****************************************!*\
  !*** ./src/server/db/listCollection.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongodb */ \"mongodb\");\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_0__);\n\n\n/**\n * List all collection by database name\n * @param {*} req \n * @param {*} res \n */\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (req, res) {\n    const mongoClient = mongodb__WEBPACK_IMPORTED_MODULE_0___default.a.MongoClient;\n    const url = 'mongodb://localhost:27017';\n    // Database name\n    const dbName = req.params.dbname;\n\n    mongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {\n        if (err) throw err;\n        let dbo = db.db(dbName);\n        // List all collections\n        dbo.listCollections().toArray(function (err, collections) {\n            if (err) throw err;\n            let collectionNames = [];\n            collections.forEach(function (collection) {\n                collectionNames.push(collection.name);\n            });\n            // Send all collection names back to user\n            res.send(collectionNames);\n            // Close connection\n            db.close();\n        });\n    });\n});\n\n//# sourceURL=webpack:///./src/server/db/listCollection.js?");

/***/ }),

/***/ "./src/server/media/video.js":
/*!***********************************!*\
  !*** ./src/server/media/video.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\n/**\n * Video streaming (stream chunk by chunk)\n * @param {*} req \n * @param {*} res \n */\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (req, res) {\n    // Important path to link with video file\n    const videoPath = path__WEBPACK_IMPORTED_MODULE_1___default.a.join('asset', req.params.loc, 'videos', req.params.tripid, req.params.filename);\n    console.log(videoPath);\n\n    // Check if video file is exist\n    if (fs__WEBPACK_IMPORTED_MODULE_0___default.a.existsSync(videoPath)) {\n        const stat = fs__WEBPACK_IMPORTED_MODULE_0___default.a.statSync(videoPath);\n        const fileSize = stat.size;\n        const range = req.headers.range;\n\n        if (range) {\n            let parts = range.replace(/bytes=/, \"\").split(\"-\");\n            let start = parseInt(parts[0], 10);\n            let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;\n\n            let chunksize = end - start + 1;\n            let file = fs__WEBPACK_IMPORTED_MODULE_0___default.a.createReadStream(videoPath, { start, end });\n\n            let head = {\n                'Content-Range': `bytes ${start} - ${end} / ${fileSize}`,\n                'Accept-Ranges': 'bytes',\n                'Content-Length': chunksize,\n                'Content-Type': 'video/mp4'\n            };\n\n            res.writeHead(206, head);\n            file.pipe(res);\n        } else {\n            let head = {\n                'Content-Length': fileSize,\n                'Content-Type': 'video/mp4'\n            };\n\n            res.writeHead(200, head);\n            fs__WEBPACK_IMPORTED_MODULE_0___default.a.createReadStream(videoPath).pipe(res);\n        }\n    }\n\n    // TODO: need to catch error here.\n});\n\n//# sourceURL=webpack:///./src/server/media/video.js?");

/***/ }),

/***/ "./src/server/newData/preprocess.js":
/*!******************************************!*\
  !*** ./src/server/newData/preprocess.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var sentiment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sentiment */ \"sentiment\");\n/* harmony import */ var sentiment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sentiment__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _util_keywords__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/keywords */ \"./src/server/util/keywords.js\");\n\n\n\nvar startTime = \"\";\nvar endTime = \"\";\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (data, index, id, date) {\n\n    var sentiment = new sentiment__WEBPACK_IMPORTED_MODULE_0___default.a();\n    var result = {\n        index: index,\n        id: id,\n        date: formatDate(date),\n        _ids: [],\n        times: [],\n        path: [],\n        narratives: [],\n        roadids: [],\n        speeds: [],\n        videoLNames: [],\n        videoRNames: [],\n        videoLTimes: [],\n        videoRTimes: [],\n        keywords: [],\n        sentiments: []\n    };\n\n    var tmpTimeGap = 0;\n\n    for (var i = 0; i < data.length; ++i) {\n        var narrative = data[i]['Sentence'] !== \"\" ? data[i]['Sentence'] : 'none';\n        var sentimentScore = sentiment.analyze(data[i]['Sentence']).score;\n        var keywords = Object(_util_keywords__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(data[i]['Sentence']);\n        var lng = parseFloat(data[i]['Longitude']);\n        var lat = parseFloat(data[i]['Latitude']);\n\n        var time = removeSquareBlanket(data[i]['timestamp']);\n        result.speeds.push(0);\n        result.videoLNames.push(id + '-L.MOV');\n        result.videoRNames.push(id + '-R.MOV');\n\n        // Need to fix this\n        //var startTime = removeSquareBlanket(data[0]['timestamp']);\n        //var videoLTime = getVideoTime(id, i, startTime, time, 'left');\n        //var videoRTime = getVideoTime(id, i, startTime, time, 'right');\n\n        //result.videoLTimes.push(videoLTime);\n        //result.videoRTimes.push(videoRTime);\n\n        result.videoLTimes.push(i);\n        result.videoRTimes.push(i);\n\n        result._ids.push(i);\n        result.roadids.push('0');\n        result.narratives.push(narrative);\n        result.sentiments.push(sentimentScore);\n        result.keywords.push(keywords);\n        result.path.push([lat, lng]);\n        result.times.push(time);\n    }\n\n    return result;\n});\n\nfunction getVideoTime(id, index, startTime, gpsTime, angle) {\n\n    if (id === '02-06-15') {\n        let lTime = hmsToSeconds('00:05:01');\n        let rTime = hmsToSeconds('00:02:45');\n        let timeRange = hmsToSeconds(gpsTime) - hmsToSeconds(startTime);\n        if (angle === 'left') {\n            return lTime + timeRange;\n        } else {\n            return rTime + timeRange;\n        }\n    } else if (id === '02-11-14') {\n        let lTime = hmsToSeconds('00:08:40');\n        let rTime = hmsToSeconds('00:00:00');\n        let timeRange = hmsToSeconds(gpsTime) - hmsToSeconds(startTime);\n        if (angle === 'left') {\n            return lTime + timeRange;\n        } else {\n            return rTime + timeRange;\n        }\n    } else if (id === '03-02-15') {\n        let lTime = hmsToSeconds('00:01:05');\n        let rTime = hmsToSeconds('00:01:05');\n        let timeRange = hmsToSeconds(gpsTime) - hmsToSeconds(startTime);\n        if (angle === 'left') {\n            return lTime + timeRange;\n        } else {\n            return rTime + timeRange;\n        }\n    } else if (id === '05-15-15') {\n        let lTime = hmsToSeconds('00:11:58');\n        let rTime = hmsToSeconds('00:12:10');\n        let timeRange = hmsToSeconds(gpsTime) - hmsToSeconds(startTime);\n        if (angle === 'left') {\n            return lTime + timeRange;\n        } else {\n            return rTime + timeRange;\n        }\n    }\n    return;\n}\n\nfunction hmsToSeconds(hms) {\n    var a = hms.split(':'); // split it at the colons\n    // minutes are worth 60 seconds. Hours are worth 60 minutes.\n    var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];\n    return seconds;\n}\n\nfunction removeSquareBlanket(str) {\n    str = str.replace('[', '');\n    str = str.replace(']', '');\n    return str;\n}\n\nfunction formatDate(dateStr) {\n    var arr = dateStr.split('-');\n    var months = [\"Jan\", \"Feb\", \"Mar\", \"Apr\", \"May\", \"Jun\", \"Jul\", \"Aug\", \"Sep\", \"Oct\", \"Nov\", \"Dec\"];\n\n    var month_index = parseInt(arr[0], 10) - 1;\n    return months[month_index] + \" \" + arr[2];\n}\n\n//# sourceURL=webpack:///./src/server/newData/preprocess.js?");

/***/ }),

/***/ "./src/server/routes/router.js":
/*!*************************************!*\
  !*** ./src/server/routes/router.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var csv_parser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! csv-parser */ \"csv-parser\");\n/* harmony import */ var csv_parser__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(csv_parser__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _db_listCollection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../db/listCollection */ \"./src/server/db/listCollection.js\");\n/* harmony import */ var _db_getAllTrips__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../db/getAllTrips */ \"./src/server/db/getAllTrips.js\");\n/* harmony import */ var _db_getAllStreets__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../db/getAllStreets */ \"./src/server/db/getAllStreets.js\");\n/* harmony import */ var _media_video__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../media/video */ \"./src/server/media/video.js\");\n/* harmony import */ var _newData_preprocess__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../newData/preprocess */ \"./src/server/newData/preprocess.js\");\n\n\n\n\n\n\n\n\n\n\n\nconst router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();\n\n// DB query\n// List all collections\nrouter.route('/listCollection/:dbname').get(_db_listCollection__WEBPACK_IMPORTED_MODULE_4__[\"default\"]);\n// List all trips\nrouter.route('/getAllTrips/:dbname/:colName').get(_db_getAllTrips__WEBPACK_IMPORTED_MODULE_5__[\"default\"]);\n// List all streets\nrouter.route('/getAllStreets/:dbname/:colName').get(_db_getAllStreets__WEBPACK_IMPORTED_MODULE_6__[\"default\"]);\n// Streaming video by source files\nrouter.route('/video/:loc,:tripid,:filename').get(_media_video__WEBPACK_IMPORTED_MODULE_7__[\"default\"]);\n\nfunction processNewData(filePath, index, id) {\n    return new Promise(function (resolve, reject) {\n        var result = [];\n        fs__WEBPACK_IMPORTED_MODULE_1___default.a.createReadStream(filePath).pipe(csv_parser__WEBPACK_IMPORTED_MODULE_3___default()()).on('error', err => reject(err)).on('data', data => result.push(data)).on('end', () => resolve(Object(_newData_preprocess__WEBPACK_IMPORTED_MODULE_8__[\"default\"])(result, index, id, id)));\n    });\n}\n\n// Get new datasets\nrouter.route('/getNewData/').get(function (req, res) {\n\n    var newDataPath = path__WEBPACK_IMPORTED_MODULE_2___default.a.join('asset', 'sample', 'data');\n\n    fs__WEBPACK_IMPORTED_MODULE_1___default.a.readdir(newDataPath, function (error, files) {\n        if (error) throw error;\n\n        var newData = [];\n        var index = 1;\n        files.forEach(function (fileName) {\n            let id = fileName.split('.')[0];\n            newData.push(processNewData(path__WEBPACK_IMPORTED_MODULE_2___default.a.join(newDataPath, fileName), index, id));\n            index++;\n        });\n\n        Promise.all(newData).then(result => {\n            res.send(result);\n        }).catch(e => {\n            throw e;\n        });\n    });\n});\n\nrouter.route('/getNewStreets/').get(function (req, res) {\n    var streetFile = path__WEBPACK_IMPORTED_MODULE_2___default.a.join('asset', 'sample', 'streets', 'akron-streets.json');\n\n    fs__WEBPACK_IMPORTED_MODULE_1___default.a.readFile(streetFile, 'utf8', function (error, data) {\n        if (error) throw error;\n        res.send(JSON.parse(data));\n    });\n});\n\n// Export global router\n/* harmony default export */ __webpack_exports__[\"default\"] = (router);\n\n//# sourceURL=webpack:///./src/server/routes/router.js?");

/***/ }),

/***/ "./src/server/server-dev.js":
/*!**********************************!*\
  !*** ./src/server/server-dev.js ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var webpack__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! webpack */ \"webpack\");\n/* harmony import */ var webpack__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(webpack__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! webpack-dev-middleware */ \"webpack-dev-middleware\");\n/* harmony import */ var webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _webpack_dev_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../webpack.dev.config */ \"./webpack.dev.config.js\");\n/* harmony import */ var _webpack_dev_config__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_webpack_dev_config__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _routes_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./routes/router */ \"./src/server/routes/router.js\");\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! body-parser */ \"body-parser\");\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_6__);\n\n\n\n\n\n\n// express routers\n\n\n\n/**\n * webpack initialize\n */\nconst app = express__WEBPACK_IMPORTED_MODULE_1___default()(),\n      DIST_DIR = __dirname,\n      HTML_FILE = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(DIST_DIR, 'index.html'),\n      compiler = webpack__WEBPACK_IMPORTED_MODULE_2___default()(_webpack_dev_config__WEBPACK_IMPORTED_MODULE_4___default.a);\n\n// parse to json attached from request body\napp.use(body_parser__WEBPACK_IMPORTED_MODULE_6___default.a.urlencoded({ extended: false }));\napp.use(body_parser__WEBPACK_IMPORTED_MODULE_6___default.a.json());\n\n// assets\napp.use(express__WEBPACK_IMPORTED_MODULE_1___default.a.static('asset'));\n// express router\napp.use('/', _routes_router__WEBPACK_IMPORTED_MODULE_5__[\"default\"]);\n\napp.use(webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_3___default()(compiler, {\n    publicPath: _webpack_dev_config__WEBPACK_IMPORTED_MODULE_4___default.a.output.publicPath\n}));\n\napp.get('*', (req, res, next) => {\n    compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {\n\n        if (err) {\n            return next(err);\n        }\n\n        res.set('content-type', 'text/html');\n        res.send(result), res.end();\n    });\n});\n\nconst PORT = process.env.PORT || 3000;\napp.listen(PORT, () => {\n    console.log(`App listening to ${PORT} ...`);\n});\n\n//# sourceURL=webpack:///./src/server/server-dev.js?");

/***/ }),

/***/ "./src/server/util/fixTimeFormat.js":
/*!******************************************!*\
  !*** ./src/server/util/fixTimeFormat.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/**\n * Fix time format to HH:MM:SS\n * @param {*} t \n */\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (t) {\n\n    if (t == 'none') return '00:00:00';\n\n    let time = t.split(':');\n    let hours = '00',\n        minutes = '00',\n        seconds = '00';\n\n    // check time format length\n    if (time.length > 2) {\n        hours = time[0];minutes = time[1];seconds = time[2].split('.')[0];\n    } else {\n        hours = '00';minutes = time[0];seconds = time[1].split('.')[0];\n    }\n\n    return hours + ':' + minutes + ':' + seconds;\n});\n\n//# sourceURL=webpack:///./src/server/util/fixTimeFormat.js?");

/***/ }),

/***/ "./src/server/util/keywords.js":
/*!*************************************!*\
  !*** ./src/server/util/keywords.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var stemmer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! stemmer */ \"stemmer\");\n/* harmony import */ var stemmer__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(stemmer__WEBPACK_IMPORTED_MODULE_0__);\n\n\n/**\n * Get all keywords from the selected narrative\n * @param {String} narrative \n */\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (narrative) {\n    let words = narrative.toLowerCase().removeStopWords().split(' ');\n    let keywords = [];\n\n    words.forEach(function (word) {\n        if (isNaN(word)) keywords.push(word); //stemmer(word));\n    });\n\n    return keywords;\n});\n\n/**\n * Remove stopword from current string\n */\nString.prototype.removeStopWords = function () {\n    let words = new Array();\n\n    this.replace(/\\b[\\w]+\\b/g, function ($0) {\n        if (!String.isStopWord($0)) {\n            words[words.length] = $0.trim();\n        }\n    });\n\n    return words.join(\" \");\n};\n\n/**\n * Check if stop word or not\n */\nString.isStopWord = function (word) {\n    let regex = new RegExp(\"\\\\b\" + word + \"\\\\b\", \"i\");\n    return stopword.search(regex) < 0 ? false : true;\n};\n\nvar stopword = \"a,able,about,above,abst,accordance,according,accordingly,across,act,actually,added,adj,\\\n  affected,affecting,affects,after,afterwards,again,against,ah,all,almost,alone,along,already,also,although,\\\n  always,am,among,amongst,an,and,announce,another,any,anybody,anyhow,anymore,anyone,anything,anyway,anyways,\\\n  anywhere,apparently,approximately,are,aren,arent,arise,around,as,aside,ask,asking,at,auth,available,away,awfully,\\\n  b,back,be,became,because,become,becomes,becoming,been,before,beforehand,begin,beginning,beginnings,begins,behind,\\\n  being,believe,below,beside,besides,between,beyond,biol,both,brief,briefly,but,by,c,ca,came,can,cannot,can't,cause,causes,\\\n  certain,certainly,co,com,come,comes,contain,containing,contains,could,couldnt,d,date,did,didn't,different,do,does,doesn't,\\\n  doing,done,don't,down,downwards,due,during,e,each,ed,edu,effect,eg,eight,eighty,either,else,elsewhere,end,ending,enough,\\\n  especially,et,et-al,etc,even,ever,every,everybody,everyone,everything,everywhere,ex,except,f,far,few,ff,fifth,first,five,fix,\\\n  followed,following,follows,for,former,formerly,forth,found,four,from,further,furthermore,g,gave,get,gets,getting,give,given,gives,\\\n  giving,go,goes,gone,got,gotten,h,had,happens,hardly,has,hasn't,have,haven't,having,he,hed,hence,her,here,hereafter,hereby,herein,\\\n  heres,hereupon,hers,herself,hes,hi,hid,him,himself,his,hither,home,how,howbeit,however,hundred,i,id,ie,if,i'll,im,immediate,\\\n  immediately,importance,important,in,inc,indeed,index,information,instead,into,invention,inward,is,isn't,it,itd,it'll,its,itself,\\\n  i've,j,just,k,keep,keeps,kept,kg,km,know,known,knows,l,largely,last,lately,later,latter,latterly,least,less,lest,let,lets,like,\\\n  liked,likely,line,little,'ll,look,looking,looks,ltd,m,made,mainly,make,makes,many,may,maybe,me,mean,means,meantime,meanwhile,\\\n  merely,mg,might,million,miss,ml,more,moreover,most,mostly,mr,mrs,much,mug,must,my,myself,n,na,name,namely,nay,nd,near,nearly,\\\n  necessarily,necessary,need,needs,neither,never,nevertheless,new,next,nine,ninety,no,nobody,non,none,nonetheless,noone,nor,\\\n  normally,nos,not,noted,nothing,now,nowhere,o,obtain,obtained,obviously,of,off,often,oh,ok,okay,old,omitted,on,once,one,ones,\\\n  only,onto,or,ord,other,others,otherwise,ought,our,ours,ourselves,out,outside,over,overall,owing,own,p,page,pages,part,\\\n  particular,particularly,past,per,perhaps,placed,please,plus,poorly,possible,possibly,potentially,pp,predominantly,present,\\\n  previously,primarily,probably,promptly,proud,provides,put,q,que,quickly,quite,qv,r,ran,rather,rd,re,readily,really,recent,\\\n  recently,ref,refs,regarding,regardless,regards,related,relatively,research,respectively,resulted,resulting,results,right,run,s,\\\n  said,same,saw,say,saying,says,sec,section,see,seeing,seem,seemed,seeming,seems,seen,self,selves,sent,seven,several,shall,she,shed,\\\n  she'll,shes,should,shouldn't,show,showed,shown,showns,shows,significant,significantly,similar,similarly,since,six,slightly,so,\\\n  some,somebody,somehow,someone,somethan,something,sometime,sometimes,somewhat,somewhere,soon,sorry,specifically,specified,specify,\\\n  specifying,still,stop,strongly,sub,substantially,successfully,such,sufficiently,suggest,sup,sure,t,take,taken,taking,tell,tends,\\\n  th,than,thank,thanks,thanx,that,that'll,thats,that've,the,their,theirs,them,themselves,then,thence,there,thereafter,thereby,\\\n  thered,therefore,therein,there'll,thereof,therere,theres,thereto,thereupon,there've,these,they,theyd,they'll,theyre,they've,\\\n  think,this,those,thou,though,thoughh,thousand,throug,through,throughout,thru,thus,til,tip,to,together,too,took,toward,towards,\\\n  tried,tries,truly,try,trying,ts,twice,two,u,un,under,unfortunately,unless,unlike,unlikely,until,unto,up,upon,ups,us,use,used,\\\n  useful,usefully,usefulness,uses,using,usually,v,value,various,'ve,very,via,viz,vol,vols,vs,w,want,wants,was,wasn't,way,we,wed,\\\n  welcome,we'll,went,were,weren't,we've,what,whatever,what'll,whats,when,whence,whenever,where,whereafter,whereas,whereby,wherein,\\\n  wheres,whereupon,wherever,whether,which,while,whim,whither,who,whod,whoever,whole,who'll,whom,whomever,whos,whose,why,widely,\\\n  willing,wish,with,within,without,won't,words,world,would,wouldn't,www,x,y,yes,yet,you,youd,you'll,your,youre,yours,yourself,\\\n  yourselves,you've,z,zero,um,yeah,uh,yea,officer,lot,po,sl,sm,day,days,start,fuck,po1,po2,will,well,going,cuz,ummm,time,ac,krystel,curtis,tom,lauren\";\n\n//# sourceURL=webpack:///./src/server/util/keywords.js?");

/***/ }),

/***/ "./src/server/util/point.js":
/*!**********************************!*\
  !*** ./src/server/util/point.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _keywords__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./keywords */ \"./src/server/util/keywords.js\");\n/* harmony import */ var _sentiment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sentiment */ \"./src/server/util/sentiment.js\");\n/* harmony import */ var _timeToSeconds__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./timeToSeconds */ \"./src/server/util/timeToSeconds.js\");\n/* harmony import */ var _fixTimeFormat__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fixTimeFormat */ \"./src/server/util/fixTimeFormat.js\");\n\n\n\n\n\n/**\n * Initialize point object\n * @param {*} point \n */\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (point) {\n\n    let videoLTime = 0,\n        videoRTime = 0;\n\n    // need more preprocessing here!\n    if (typeof point.media_time_left != 'number') {\n        videoLTime = Object(_timeToSeconds__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(Object(_fixTimeFormat__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(point.media_time_left));\n        videoRTime = Object(_timeToSeconds__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(Object(_fixTimeFormat__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(point.media_time_right));\n    } else {\n        videoLTime = point.media_time_left;\n        videoRTime = point.media_time_right;\n    }\n\n    let pointObject = {\n        tid: point.tripid,\n        _id: point._id,\n        date: point.pdatetime.split(' ')[0],\n        time: point.pdatetime.split(' ')[1],\n        coord: [point.lat, point.lng],\n        narrative: point.narrative,\n        rid: point.rid,\n        speed: point.speed,\n        videoLName: point.media_name_left,\n        videoRName: point.media_name_right,\n        videoLTime: videoLTime,\n        videoRTime: videoRTime,\n        keyword: Object(_keywords__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(point.narrative),\n        sentiment: Object(_sentiment__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(point.narrative)\n    };\n\n    return pointObject;\n});\n\n//# sourceURL=webpack:///./src/server/util/point.js?");

/***/ }),

/***/ "./src/server/util/processStreets.js":
/*!*******************************************!*\
  !*** ./src/server/util/processStreets.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/**\n * Preprocessing streets data\n * @param {*} segments - street segments\n */\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (segments) {\n    var streets = [],\n        lineSegments = [],\n        roadSegments = [];\n\n    for (var i = 0, len = segments.length; i < len; i++) {\n\n        var name = segments[i].name,\n            highway = segments[i].highway,\n            linestring = segments[i].geometry.coordinates,\n            roadid = segments[i].osm_id;\n\n        if (name != 'none') {\n            // Find any duplicate street name\n            var pos = streets.map(function (x) {\n                return x.name;\n            }).indexOf(name);\n\n            if (pos == -1) {\n\n                lineSegments = [], roadSegments = [];\n                lineSegments.push(linestring);roadSegments.push(roadid);\n\n                // Street data structure\n                var street = {\n                    name: name,\n                    type: highway,\n                    segments: lineSegments,\n                    ids: roadSegments\n                };\n                streets.push(street);\n            } else {\n                streets[pos].segments.push(linestring);\n                streets[pos].ids.push(roadid);\n            }\n        }\n    }\n\n    return streets;\n});\n\n//# sourceURL=webpack:///./src/server/util/processStreets.js?");

/***/ }),

/***/ "./src/server/util/processTrips.js":
/*!*****************************************!*\
  !*** ./src/server/util/processTrips.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _trip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./trip */ \"./src/server/util/trip.js\");\n/* harmony import */ var _point__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./point */ \"./src/server/util/point.js\");\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (data) {\n    let current,\n        next,\n        index = 1,\n        trips = [];\n\n    let trip = Object(_trip__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(index);\n\n    let i = 0,\n        len = data.length;\n    console.log('Preprocess ' + len + ' items');\n\n    while (i < len) {\n        // Set current data\n        current = data[i];\n\n        if (current.tripid !== 1011416) {\n            if (i != len - 1) {\n                next = data[i + 1];\n            } else {\n                next = data[(i + 1) % data.length];\n            }\n\n            let point_1 = Object(_point__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(current),\n                point_2 = Object(_point__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(next);\n\n            if (point_1.tid == point_2.tid) {\n                trip = Object(_trip__WEBPACK_IMPORTED_MODULE_0__[\"add\"])(trip, point_1);\n            } else {\n                trip = Object(_trip__WEBPACK_IMPORTED_MODULE_0__[\"add\"])(trip, point_1);\n                trip.id = point_1.tid;\n\n                trip.date = point_1.date;\n                trips.push(trip);\n\n                index++;\n\n                trip = Object(_trip__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(index);\n            }\n        }\n        ++i;\n    }\n\n    return trips;\n});\n\n//# sourceURL=webpack:///./src/server/util/processTrips.js?");

/***/ }),

/***/ "./src/server/util/sentiment.js":
/*!**************************************!*\
  !*** ./src/server/util/sentiment.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var sentiment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sentiment */ \"sentiment\");\n/* harmony import */ var sentiment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sentiment__WEBPACK_IMPORTED_MODULE_0__);\n\n\n/**\n * Calculate sentiment score\n * @param {String} narrative \n */\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (narrative) {\n  let sentiment = new sentiment__WEBPACK_IMPORTED_MODULE_0___default.a();\n  let score = sentiment.analyze(narrative).score;\n\n  return score;\n});\n\n//# sourceURL=webpack:///./src/server/util/sentiment.js?");

/***/ }),

/***/ "./src/server/util/timeToSeconds.js":
/*!******************************************!*\
  !*** ./src/server/util/timeToSeconds.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/**\n * Convert HH:MM:SS to seconds\n * @param {String} timeString \n */\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (timeString) {\n  let t = timeString.split(':');\n  return +t[0] * 60 * 60 + +t[1] * 60 + +t[2];\n});\n\n//# sourceURL=webpack:///./src/server/util/timeToSeconds.js?");

/***/ }),

/***/ "./src/server/util/trip.js":
/*!*********************************!*\
  !*** ./src/server/util/trip.js ***!
  \*********************************/
/*! exports provided: default, add */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"add\", function() { return add; });\n/**\n * Create new trip object\n * @param {Number} index - trip index\n */\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (index) {\n    return {\n        index: index, id: null, date: null,\n        _ids: [],\n        times: [],\n        path: [],\n        narratives: [],\n        roadids: [],\n        speeds: [],\n        videoLNames: [],\n        videoRNames: [],\n        videoLTimes: [],\n        videoRTimes: [],\n        keywords: [],\n        sentiments: []\n    };\n});\n\n/**\n * Add current point to specific trip\n * @param {*} trip \n * @param {*} point \n */\nfunction add(trip, point) {\n    trip._ids.push(point._id);\n    trip.times.push(point.time);\n    trip.path.push(point.coord);\n    trip.narratives.push(point.narrative);\n    trip.roadids.push(point.rid);\n    trip.speeds.push(point.speed);\n    trip.videoLNames.push(point.videoLName);\n    trip.videoRNames.push(point.videoRName);\n    trip.videoLTimes.push(point.videoLTime);\n    trip.videoRTimes.push(point.videoRTime);\n    trip.keywords.push(point.keyword);\n    trip.sentiments.push(point.sentiment);\n    return trip;\n}\n\n//# sourceURL=webpack:///./src/server/util/trip.js?");

/***/ }),

/***/ "./webpack.dev.config.js":
/*!*******************************!*\
  !*** ./webpack.dev.config.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const path = __webpack_require__(/*! path */ \"path\");\nconst webpack = __webpack_require__(/*! webpack */ \"webpack\");\nconst htmlWebpackPlugin = __webpack_require__(/*! html-webpack-plugin */ \"html-webpack-plugin\");\n\nmodule.exports = {\n    // Define entry point.\n    entry: {\n        main: './src/index.js'\n    },\n    // Define webpack built.\n    output: {\n        path: path.join(__dirname, 'dist'),\n        publicPath: '/',\n        filename: '[name].js'\n    },\n    // Development mode\n    mode: 'development',\n    // Targeting to frontend\n    target: 'web',\n\n    devtool: '#source-map',\n\n    node: {\n        fs: 'empty'\n    },\n\n    module: {\n        rules: [{\n            test: /\\.js$/,\n            exclude: /node_modules/,\n            loader: 'babel-loader'\n        }, {\n            // Loads javascript into html template\n            // Entry point is set below\n            test: /\\.html$/,\n            use: [{\n                loader: 'html-loader'\n                // options: { minimize: true }\n            }]\n        }, {\n            test: /\\.css$/,\n            use: ['style-loader', 'css-loader']\n        }, {\n            test: /\\.(png|svg|jpg|gif)$/,\n            use: ['file-loader']\n        }]\n    },\n\n    plugins: [new htmlWebpackPlugin({\n        template: './src/html/index.html',\n        filename: './index.html',\n        excludeChunks: ['server']\n    }), new webpack.ProvidePlugin({\n        $: 'jquery',\n        jQuery: 'jquery',\n        L: 'leaflet',\n        _: 'lodash',\n        d3: 'd3-3',\n        d3v4: 'd3v4',\n        Fuse: 'fuse.js',\n        turf: '@turf/turf',\n        Chart: 'chart.js'\n    }), new webpack.NoEmitOnErrorsPlugin(), new webpack.DefinePlugin({\n        'process.browser': 'true'\n    })]\n};\n\n//# sourceURL=webpack:///./webpack.dev.config.js?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "csv-parser":
/*!*****************************!*\
  !*** external "csv-parser" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"csv-parser\");\n\n//# sourceURL=webpack:///external_%22csv-parser%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "html-webpack-plugin":
/*!**************************************!*\
  !*** external "html-webpack-plugin" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"html-webpack-plugin\");\n\n//# sourceURL=webpack:///external_%22html-webpack-plugin%22?");

/***/ }),

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongodb\");\n\n//# sourceURL=webpack:///external_%22mongodb%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "sentiment":
/*!****************************!*\
  !*** external "sentiment" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"sentiment\");\n\n//# sourceURL=webpack:///external_%22sentiment%22?");

/***/ }),

/***/ "stemmer":
/*!**************************!*\
  !*** external "stemmer" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"stemmer\");\n\n//# sourceURL=webpack:///external_%22stemmer%22?");

/***/ }),

/***/ "webpack":
/*!**************************!*\
  !*** external "webpack" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack\");\n\n//# sourceURL=webpack:///external_%22webpack%22?");

/***/ }),

/***/ "webpack-dev-middleware":
/*!*****************************************!*\
  !*** external "webpack-dev-middleware" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack-dev-middleware\");\n\n//# sourceURL=webpack:///external_%22webpack-dev-middleware%22?");

/***/ })

/******/ });