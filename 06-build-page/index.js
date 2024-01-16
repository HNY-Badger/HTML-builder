const fs = require('node:fs');
const path = require('node:path');
const dirPath = './06-build-page';

function errNotify(err) {
  // Turned off to keep console clean
  // if (err) console.log(err);
}

function bundleStyle(from, to) {
  const stream = fs.createWriteStream(`${to}/style.css`);
  fs.readdir(from, (err, files) => {
    errNotify(err);
    files.forEach((file) => {
      if (path.extname(file) === '.css') {
        fs.readFile(`${from}/${file}`, (err, data) => {
          errNotify(err);
          stream.write(`/* Styles from the ${file} */\n${data}\n`);
        });
      }
    });
  });
}

function copyDir(from, to) {
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
}

function componentsSetup(callback) {
  const components = {};
  fs.readdir(`${dirPath}/components`, (err, files) => {
    errNotify(err);
    let counter = files.length;
    files.forEach((file) => {
      counter--;
      if (path.extname(file) === '.html') {
        fs.readFile(`${dirPath}/components/${file}`, (err, data) => {
          errNotify(err);
          components[`{{${path.basename(file, '.html')}}}`] = data.toString();
        });
      }
      if (counter === 0) {
        callback(components);
      }
    });
  });
}

function buildHTML(dest) {
  fs.mkdir(dest, errNotify);
  bundleStyle(`${dirPath}/styles`, dest);
  copyDir(`${dirPath}/assets`, `${dest}/assets`);

  componentsSetup((components) => {
    fs.readFile(`${dirPath}/template.html`, (err, data) => {
      errNotify(err);
      let html = data.toString();
      Object.keys(components).forEach((key) => {
        while (html.includes(key)) {
          html = html.replace(key, components[key]);
        }
      });
      const writer = fs.createWriteStream(`${dest}/index.html`);
      writer.write(html);
    });
  });
}

buildHTML(`${dirPath}/project-dist`);
