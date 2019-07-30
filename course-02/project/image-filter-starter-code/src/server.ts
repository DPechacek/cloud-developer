import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import * as path from "path";
import * as fs from "fs";

const mimeTypes: {[key: string]: string} = {
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml'
};

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get("/filteredimage", async (req, res) => {
    let imageUrl = req.query.image_url;
    
    if(!imageUrl || imageUrl.match('(http(s?):)([/|.|\\w|\\s|-])*\\.(?:jpg|jpeg|gif|png)').length === 0) {
      res.status(400).end("You must include a valid image url.")
      return;
    }
    
    try {
      let resultImagePath = await filterImageFromURL(imageUrl);
  
      let type: string = mimeTypes[path.extname(resultImagePath).slice(1)] || 'text/plain';
      let readStream = fs.createReadStream(resultImagePath);
      readStream.on('open', function () {
        res.set('Content-Type', type);
        readStream.pipe(res);
      });
      readStream.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Error loading file.');
      });
      readStream.on('end', function() {
        deleteLocalFiles([resultImagePath]);
      });
    }
    catch (e) {
      res.set('Content-Type', 'text/plain');
      res.status(404).end('Error loading file.');
    }
  });
  
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
