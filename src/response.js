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
    this.#res.statusCode = this.statusCode;
  }

  setHeader(name, value) {
    this.#res.setHeader(name, value);
  }

  setStatusCode(code) {
    this.statusCode = code;
    this.#res.statusCode = code;
  }

  async #getFile(filepath) {
    try {
      const file = await fs.readFile(filepath);
      return file;
    } catch (err) {
      return null;
    }
  }

  async sendView(view) {
    this.setHeader("Content-Type", "text/html");
    const filePath = path.join(process.cwd(), "views", view);
    const file = await this.#getFile(filePath);
    this.#writeFileToRes(file);
  }

  async sendFile(filePath) {
    const file = await this.#getFile(filePath);
    this.#writeFileToRes(file);
  }

  async #writeFileToRes(file) {
    if (file) {
      this.#res.write(file);
    } else {
      this.setStatusCode(404);
    }
    this.end();
  }

  sendJSON(message, data = {}) {
    this.setHeader("Content-Type", "application/json");
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
