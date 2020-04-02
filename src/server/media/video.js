import fs from 'fs';
import path from 'path';

/**
 * Video streaming (stream chunk by chunk)
 * @param {*} req 
 * @param {*} res 
 */
export default function (req, res) 
{
    // Important path to link with video file
    const videoPath = path.join('asset', req.params.loc, 'videos', req.params.tripid, req.params.filename);
    console.log(videoPath);

    // Check if video file is exist
    if (fs.existsSync(videoPath)) {
        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            let parts = range.replace(/bytes=/, "").split("-");
            let start = parseInt(parts[0], 10);
            let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            let chunksize = (end - start) + 1;
            let file = fs.createReadStream(videoPath, {start, end});

            let head = {
                'Content-Range': `bytes ${start} - ${end} / ${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(206, head);
            file.pipe(res);

        } else {
            let head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4'
            };

            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    }

    // TODO: need to catch error here.
}