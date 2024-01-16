const fs = require('node:fs');

function errorNotifier(err) {
  if (err) console.log(err);
}

function copyDir(from, to) {
  fs.mkdir(to, errorNotifier);
  fs.readdir(from, (err, files) => {
    errorNotifier(err);
    files.forEach((file) => {
      fs.stat(`${from}/${file}`, (err, stats) => {
        errorNotifier(err);
        if (stats.isFile()) {
          fs.copyFile(`${from}/${file}`, `${to}/${file}`, errorNotifier);
        } else if (stats.isDirectory()) {
          copyDir(`${from}/${file}`, `${to}/${file}`);
        }
      });
    });
  });
}
const pathToCopy = './04-copy-directory/files';
copyDir(pathToCopy, pathToCopy + '-copy');
