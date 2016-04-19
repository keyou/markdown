console.log("markdown.js");
var fs = require("fs");
var data = fs.readFileSync("sample.md","utf-8");

var paragraph = /\r\n\r\n|  \r\n|\n\n|  \n/g; // paragraph
var title = [/^\s*#{1,6}\s*(.*)$/,/\s*(.*?)[-=]{4,}\s*$/]; // title
var list = /^\s*[\*|>] /;// no sort list
var sortList = /^\s*\d|a-z] /;// sort list
var style = [/\*[^ ]*[^ ]\*/]; // inlines

function parse(p){
    var rlt = p.match(title[0]);
    if(rlt){
        console.log("Title: "+rlt[1]);
        return;
    }
    rlt = p.match(title[1]);
    if(rlt){
        console.log("Title: "+rlt[1]);
        return;
    }
    
}


var paras = data.split(paragraph);
for (var i = 0; i < paras.length; i++) {
    var para = paras[i];
    //console.log(para);
    console.log("=====================");
    var p = para.replace(/\r\n|\n/,"");
    parse(p);
}

//paragraph.match()
