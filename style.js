var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var fileName = {day: 'numeric'};
var today  = new Date();

document.getElementById("date").innerHTML = today.toLocaleDateString("en-GB", options);

console.log(today.toLocaleDateString("en-US")); // 9/17/2016
console.log(today.toLocaleDateString("en-US", options)); // Saturday, September 17, 2016

const date = new Date();

const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

const formattedDate = formatter.formatToParts(date).reduce((acc, part) => {
  if (part.type === 'year' || part.type === 'month' || part.type === 'day') {
    return acc + part.value;
  } else {
    return acc;
  }
}, '');

//"DON_2010_JOE_1222022.txt".match(/DON_.+_JOE_.+\.txt/)

const fs = require("fs");
const path = require("path");

const directoryPath = "./entries"; // Directory to search
const fileNameToSearch = formattedDate.match(/.+\.html/); // Replace with the variable name

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
  } else {
    const foundFile = files.find(file => file === fileNameToSearch);

    if (foundFile) {
      console.log('File found:', foundFile);
      // Send the file information back to the client
    } else {
      console.log('File not found.');
    }
  }
});