class Request {
  #req;
  #data = null;
  constructor(req) {
    this.#req = req;
  }

  getURL() {
    return this.#req.url;
  }

  async readData() {
    return new Promise((resolve) => {
      let data = "";
      this.#req.on("data", (chunk) => {
        data += chunk;
      });
      this.#req.on("end", () => {
        resolve(data);
        this.#data = data;
      });
      this.#req.on("error", (err) => {
        resolve(null);
      });
    });
  }

  async json() {
    await this.readData();
    let json = {};
    if (this.#data) {
      let fieldsInput = this.#data.split("&");
      for (let field of fieldsInput) {
        let entry = field.split("=");
        let key = entry[0];
        let value = null;
        if (entry.length > 1) {
          value = decodeURI(entry[1]);
        }
        json[key] = value;
      }
    }
    return json;
  }
}

module.exports = Request;
