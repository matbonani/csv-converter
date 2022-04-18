const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require('fs');

var Processor = require("./Class/Processor");
var Reader = require("./Class/Reader");
var Table = require("./Class/Table"); 
var HtmlParser = require("./Class/HtmlParser");
var Write = require("./Class/Writer");
var PdfWriter = require("./Class/PdfWriter");

// conf multer
const storage = multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, "uploads/")
    },
    filename: function(req, file, cb){
      cb(null, 
        file.originalname + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage});

// view engine
app.set("view engine", "ejs");

//parser config
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// static files
app.use(express.static("./public"));

// Instancias
var leitor = new Reader();
var escritor = new Write();

// Função principal
async function main(option, file){
    var dados = await leitor.Read("./uploads/" + file);
    var dadosProcessados = Processor.Process(dados);

    var usuarios = new Table(dadosProcessados);
    var html = await HtmlParser.Parse(usuarios);
    if(option == "html"){

        // Gerando arquivo html 
        await escritor.Write("./converted/"+ file + "_converted.html", html);
        return document = `./converted/${file}_converted.html`;
    
      } else if (option == "pdf"){
        // Gerando arquivo PDF
        let result = await PdfWriter.Write("./converted/"+ file + "_converted.pdf", html);
        return document = `./converted/${file}_converted.pdf`;
      }
    
}

// Rota Principal
app.get("/", (req, res) => {
    res.render("index");
})

// Rota para converter
app.post("/convert", upload.single("file"), async (req, res) => {
    const { option } = await req.body; 
    const filename = req.file.filename;
  
    // recebendo o caminho do arquivo convertido
    const converted = await main(option, filename); 
     res.download(converted);
});


// Servidor
app.listen(3030, () => {
    console.log("Servidor rodando...");
})