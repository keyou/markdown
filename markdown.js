console.log("markdown.js");
var fs = require("fs");
var data = fs.readFileSync("sample.md", "utf-8");

var paragraph = /\n(?:\s*\n)+|  \n(?:\s*\n)*/g; // paragraph
var title = [/^\s*#{1,6}\s*([\S\s]*)$/, /^\s*([\S\s]*?)\n[-=]{4,}\s*$/]; // title
//var list = /^\s*\* \s*(.*)$/mg;// no sort list
var sortList = /^\s*([\da-zA-Z\*>])\.{0,1} \s*(.*)$/mg;// sort list
var style = [/\*[^ ]*[^ ]\*/]; // inlines

var code = /\n*`{3,}(.*)\n([\S\s]*)?\n`{3,}\n*/g;

var preSplit = /\n(`{3,}.*)\n/g;

var preSplitA = /\n*(`{3,}.*\n[\S\s]*?\n`{3,})\n*/g;

var delimiter = /^\s*(`{3,})*.$/;

function parse(p) {
    var rlt = p.match(title[0]);
    if (rlt) {
        console.log("Title: " + rlt[1]);
        return;
    }
    
    rlt = p.match(title[1]);
    if (rlt) {
        console.log("Title: " + rlt[1]);
        return;
    }

    while ((rlt = sortList.exec(p))) {
        console.log("List: " + rlt[1] + ". " + rlt[2]);
    }

    rlt = code.exec(p);
    if (rlt) {
        console.log("PPara: " + rlt[1] + "\n" + rlt[2]);
    }

    // rlt = p.match(list)
    // if(rlt){
    //     rlt.forEach(function(element) {
    //         console.log("List: "+element[1]);
    //     }, rlt);
    // }

}

data = data.replace(/\r\n/, "\n");
data = data.split(preSplitA);

for (var i = 0; i < data.length; i++) {
    var d = data[i];
    //console.log(para);
    if(!preSplitA.test(d)){
        var paras = d.split(paragraph);
        paras.forEach(function(e) {
            console.log("=====================");
            parse(e);
        }, paras);
    }
    else{
        console.log("=====================");
        parse(d);
    }
}

//paragraph.match()
