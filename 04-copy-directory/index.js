const fs = require('node:fs');

function errNotify(err) {
  if (err) console.log(err);
}

function copyDir(from, to) {
  fs.rm(to, { recursive: true, force: true }, (err) => {
    errNotify(err);
    fs.mkdir(to, errNotify);
    fs.readdir(from, (err, files) => {
      errNotify(err);
      files.forEach((file) => {
        fs.stat(`${from}/${file}`, (err, stats) => {
          errNotify(err);
          if (stats.isFile()) {
            fs.copyFile(`${from}/${file}`, `${to}/${file}`, errNotify);
          } else if (stats.isDirectory()) {
            copyDir(`${from}/${file}`, `${to}/${file}`);
          }
        });
      });
    });
  });
}
const pathToCopy = './04-copy-directory/files';
copyDir(pathToCopy, pathToCopy + '-copy');
