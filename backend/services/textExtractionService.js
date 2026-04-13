const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');

exports.extractText = async (filePath, mimetype) => {
  try {
    if (mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      // pdf-parse 2.x uses a class-based API
      const parser = new PDFParse({ data: dataBuffer });
      const data = await parser.getText();
      return data.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimetype === 'application/msword') {
      const data = await mammoth.extractRawText({ path: filePath });
      return data.value;
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (err) {
    console.error('Text extraction error:', err);
    throw err;
  }
};

exports.cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
};
