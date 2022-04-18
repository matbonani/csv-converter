var pdf = require("html-pdf");
const util = require("util");

class PdfWriter{
    static async Write(filename, html){
      let options = {
        filename: filename
      }
      
      const create = util.promisify(pdf.create);
      let creator = await create(html, options);
      return(creator);
    }
  }
module.exports = PdfWriter;