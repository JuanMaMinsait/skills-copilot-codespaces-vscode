// Create web server
// Create a new web server using the 'http' module
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const comments = require('./comments');
const mime = require('mime');
const formidable = require('formidable');
const util = require('util');
const querystring = require('querystring');
const port = 3000;

const server = http.createServer((req, res) => {
  const urlData = url.parse(req.url, true);
  const filePath = urlData.pathname === '/' ? './public/index.html' : `./public${urlData.pathname}`;
  const ext = path.extname(filePath);
  const contentType = mime.getType(ext);

  if (req.method === 'GET') {
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found!');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  } else if (req.method === 'POST') {
    if (urlData.pathname === '/comment') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const data = querystring.parse(body);
        comments.addComment(data.comment, (err, comment) => {
          if (err) {
            res.writeHead(500);
            res.end('Server error!');
          } else {
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(comment));
          }
        });
      });
    } else if (urlData.pathname === '/upload') {
      const form = formidable({ multiples: true });

      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error(err);
          return;
        }
        res.writeHead(200, { 'content-type': 'text/plain' });
        res.write('received upload:\n\n');
        res.end(util.inspect({ fields: fields, files: files }));
      });
    }
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
// Run the server
// Run the server using the following command:
// node comments.js
// Open the browser and navigate to http://localhost:3000
// You should see the index.html file in the browser.
// Add a comment and click the 'Add Comment' button.
// You should see the comment in the browser.
// Summary

