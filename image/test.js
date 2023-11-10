const encode = require("./cryptography/encode");
const decode = require("./cryptography/decode");
const fs = 	require("fs"); //for file operations like reading and writing files. Use "fs.readFileSync(path)" if you are not using a library

let data = JSON.stringify(fs.readFileSync("./test.kig", "utf-8"));
// let chunks = getChunks(data, 1000);
// console.log(data);
data = encode(data);
fs.writeFileSync("./test.kig", data); //outputs encrypted text to out.txt file. Note: the original file is not deleted

function getChunks(str, chunkSize) {
    const chunks = [];
    for (let i = 0; i < str.length; i += chunkSize) {
      chunks.push(str.substr(i, chunkSize));
    }
    return chunks;
  }