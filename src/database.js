const fsSync = require("fs");
const fs = require("fs/promises");
const path = require("path");

class JSONDatabase {
  #DB = null;
  #dbPath = null;
  #content = {
    data: [],
    db: null,
  };

  constructor(fileName) {
    this.#DB = fileName.split(".")[0];
    const dbPath = path.join(process.cwd(), fileName);
    this.#dbPath = dbPath;
    if (!fsSync.existsSync(dbPath)) {
      fsSync.writeFileSync(
        dbPath,
        Buffer.from(
          JSON.stringify({
            db: this.#DB,
            data: [],
          })
        ),
        {
          encoding: "utf8",
        }
      );
    }

    this.#content = JSON.parse(
      fsSync.readFileSync(dbPath, { encoding: "utf8" })
    );
  }

  async insert(data) {
    const id = this.#content.data.length + 1;
    data = {
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.#content.data.push(data);
    await this.#writeToFile();
    return data;
  }

  async update(id, data) {
    let updatedProdIdx = this.#content.data.findIndex((item) => item.id === id);
    let deletedItem = this.#content.data.splice(updatedProdIdx, 1)[0];
    data = {
      ...data,
      id: deletedItem.id,
      createdAt: deletedItem.createdAt,
      updatedAt: new Date(),
    };
    this.#content.data.splice(updatedProdIdx, 0, data);
    await this.#writeToFile();
  }

  async delete(id) {
    let deletedProdIdx = this.#content.data.findIndex((item = item.id === id));
    this.#content.data.splice(deletedProdIdx, 1);
    await this.#writeToFile();
  }

  find(id) {
    if (id) {
      return this.#content.data.find((item) => item.id === id);
    } else {
      return this.#content.data;
    }
  }

  async #writeToFile() {
    await fs.writeFile(
      this.#dbPath,
      Buffer.from(JSON.stringify(this.#content)),
      {
        encoding: "utf8",
      }
    );
  }
}

module.exports = JSONDatabase;
