const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const types = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif" };

http.createServer((request, response) => {
  const pathname = decodeURIComponent((request.url || "/").split("?")[0]);
  let file = path.resolve(root, pathname === "/" ? "index.html" : `.${pathname}`);
  if (!file.startsWith(root)) return response.writeHead(403).end("Forbidden");
  
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    // SPA fallback to index.html for routes like /username
    file = path.resolve(root, "index.html");
  }

  fs.readFile(file, (error, content) => {
    if (error) return response.writeHead(404).end("Not found");
    response.writeHead(200, { "Content-Type": `${types[path.extname(file).toLowerCase()] || "application/octet-stream"}; charset=utf-8` });
    response.end(content);
  });
}).listen(5500, "127.0.0.1", () => console.log("Portfolio: http://127.0.0.1:5500"));
