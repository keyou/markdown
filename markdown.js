console.log("markdown.js");
var fs = require("fs");
var data = fs.readFileSync("sample.md","utf-8");

var paragraph = /\r\n\r\n|  \r\n|\n\n|  \n/g; // paragraph
var title = [/^\s*#{1,6}\s*([\S\s]*)$/,/^\s*([\S\s]*?)[-=]{4,}\s*$/]; // title
//var list = /^\s*\* \s*(.*)$/mg;// no sort list
var sortList = /^\s*([\da-zA-Z\*])\.{0,1} \s*(.*)$/mg;// sort list
var style = [/\*[^ ]*[^ ]\*/]; // inlines
var ppara = /^\s*(>|`{3,}.*(?:\r\n|\n)) \s*([\S\s]*)$/;

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
    
    while((rlt = sortList.exec(p))){
        console.log("List: "+rlt[1]+". "+rlt[2]);
    }
    
    rlt = p.match(ppara);
    if(rlt){
        console.log("PPara: "+ rlt[1]+" "+rlt[2]);
    }
    
    // rlt = p.match(list)
    // if(rlt){
    //     rlt.forEach(function(element) {
    //         console.log("List: "+element[1]);
    //     }, rlt);
    // }
    
}


var paras = data.split(paragraph);
for (var i = 0; i < paras.length; i++) {
    var para = paras[i];
    //console.log(para);
    console.log("=====================");
    var p = para;//.replace(/\r\n|\n/,"");
    parse(p);
}

//paragraph.match()
