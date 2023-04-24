const http = require("http");

http
  .createServer((request, response) => {
    let body = [];
    request
      .on("error", (err) => {
        console.error(err);
      })
      .on("data", (chunk) => {
        body.push(chunk.toString());
      })
      .on("end", () => {
        // https://nodejs.cn/api/buffer.html#static-method-bufferfromstring-encoding
        // https://nodejs.cn/api/buffer.html#static-method-bufferconcatlist-totallength
        // body = (Buffer.concat([Buffer.from(body.toString())])).toString();
        body = body.join("");
        console.log("body:", body);
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(" Hello world\n");
      });
  })
  .listen(8088);

console.log("server started");
