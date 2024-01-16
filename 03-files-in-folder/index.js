const fs = require('node:fs');
const path = require('node:path');
fs.readdir(
  './03-files-in-folder/secret-folder',
  (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
    files.forEach((file) => {
      let extension = path.extname(file);
      let filename = path.basename(file, extension);
      fs.stat(fullPath(file), (err, stats) => {
        if (err) {
          console.log(err);
          return;
        }
        if (stats.isFile()) {
          console.log(`${filename} - ${extension.slice(1)} - ${(stats.size * 0.001).toFixed(2)}KB`);
        }
      });
    });
  },
  { withFileTypes: true },
);

function fullPath(end) {
  return `./03-files-in-folder/secret-folder/${end}`;
}
