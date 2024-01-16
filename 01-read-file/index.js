const fs = require('node:fs');
const stream = fs.createReadStream('./01-read-file/text.txt');
stream.on('open', () => {
  console.log('<<Open stream>>');
});
stream.on('readable', () => {
  let read = stream.read();
  if (read) {
    console.log(read.toString());
  }
});
stream.on('end', () => {
  console.log('<<End stream>>');
});
