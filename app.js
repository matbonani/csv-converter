var Processor = require("./Processor");
var Reader = require("./Reader");
var Table = require("./Table"); 
var HtmlParser = require("./HtmlParser");
var Write = require("./Writer");
var PdfWriter = require("./PdfWriter");

var leitor = new Reader();
var escritor = new Write();


async function main(){
    var dados = await leitor.Read("./users.csv");
    var dadosProcessados = Processor.Process(dados);

    var usuarios = new Table(dadosProcessados);
    var html = await HtmlParser.Parse(usuarios);

    escritor.Write(Date.now() + ".html", html);
    PdfWriter.WritePDF(Date.now() + ".pdf", html);
}

main();