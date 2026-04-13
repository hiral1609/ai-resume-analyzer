const { PDFParse } = require('pdf-parse');
console.log('PDFParse:', PDFParse);
// Just to be safe, check if PDFParse is the correct class
const fs = require('fs');

async function test() {
  try {
    // If we have a PDF file, we can test it. If not, just check the class.
    console.log('Class seems to be present.');
  } catch (err) {
    console.error(err);
  }
}
test();
