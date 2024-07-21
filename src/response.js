const fs = require("fs/promises");
const path = require("path");

const STATUS_CODE = {};
function getStatusCodeText(statusCode) {
  switch (statusCode) {
    case 200:
      return "Ok";
    case 201:
      return "Created";
    case 404:
      return "Not Found";
    case 400:
      return "Bad Request";
    case 500:
      return "Server Error";
    case 307:
      return "Temporary Redirect";
    default:
      return "";
  }
}
class Response {
  #req;
  #res;
  statusCode = 200;

  constructor(res, req) {
    this.#res = res;
    this.#req = req;
    this.setHeader("Content-Type", "application/json");
  }

  setHeader(name, value) {
    this.#res.setHeader(name, value);
  }

  setStatusCode(code) {
    this.statusCode = code;
    this.#res.statusCode = code;
  }

  async sendFile(view, data = {}) {
    this.#res.statusCode = this.statusCode;
    const filePath = path.join(process.cwd(), "views", view);
    const file = await fs.readFile(filePath);
    this.sendHTML(file.toString("utf8"));
  }

  sendHTML(html) {
    this.setHeader("Content-Type", "text/html");
    this.#res.write(html);
    this.end();
  }

  sendJSON(message, data = {}) {
    this.#res.statusCode = this.statusCode;
    this.#res.write(
      JSON.stringify({
        status: this.statusCode,
        message,
        data,
      })
    );
    this.end();
  }

  end() {
    console.log(
      `${new Date().toUTCString()}: ${this.#req.method} ${this.#req.url} ${
        this.statusCode
      } ${getStatusCodeText(this.statusCode)}`
    );
    this.#res.end();
  }
}

module.exports = Response;
