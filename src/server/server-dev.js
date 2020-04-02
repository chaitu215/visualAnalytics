import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import config from '../../webpack.dev.config';

// express routers
import routes from './routes/router';
import bodyParser from 'body-parser';

/**
 * webpack initialize
 */
const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html'),
            compiler = webpack(config);

// parse to json attached from request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// assets
app.use(express.static('asset'));
// express router
app.use('/', routes);

app.use(webpackDevMiddleware( compiler, {
    publicPath: config.output.publicPath
}));

app.get('*', (req, res, next) => {
    compiler.outputFileSystem.readFile( HTML_FILE, (err, result) => {

        if (err) {
            return next(err);
        }

        res.set('content-type', 'text/html');
        res.send(result),
        res.end();
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App listening to ${PORT} ...`);
});