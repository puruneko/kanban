const fs = require('fs');

const myReadFile = {
  readFile: function (path) {
    fs.readFile(path, (error, text) => {
      if (error != null) {
        console.log('error : ' + error);
        return;
      }
      console.log(text.toString());
    });
  }
};

module.exports = myReadFile;
