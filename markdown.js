console.log("markdown.js");
var fs = require("fs");
var data = fs.readFileSync("sample.md", "utf-8");


var preSplit = /\n*(`{3,}.*\n[\S\s]*?\n`{3,})\n*/g; // presplit

var code = /\n*`{3,}(.*)\n([\S\s]*)?\n`{3,}\n*/g; // code 
var paragraph = /\n(?:\s*\n)+|  \n(?:\s*\n)*/g; // paragraph
var title = [/^\s*#{1,6}\s*([\S\s]*)$/, /^\s*([\S\s]*?)\n[-=]{4,}\s*$/]; // title
var list = /^\s*([\da-zA-Z\*>])\.{0,1} \s*(.*)$/mg;// list
var listSplit = /^\s*([\da-zA-Z\*>])\.{0,1} /m;

var style = /([_*`]{1,2})(.*?[^\\])(\1)/mg; // inlines
var styleSplit = /^[_*`]{1,2}$/;

var linkRgx = /\[([^\[\]]*)\](\((?:[^\(\)]|\(.*?\))*?\)|\[[^\[\]]*\])/mg;

var spaceData = /^\s*$/;

function parseContent(p) {
    var para = [];
    var rlt;

    while((rlt = linkRgx.exec(p))){
        
        console.log("Link: "+rlt[0]);
    }

    rlt = p.split(style);
    if (rlt) {
        var isSpliting = false;
        var lastSplit;
        rlt.forEach(function (e) {
            if (styleSplit.test(e)) {
                isSpliting = !isSpliting;
                lastSplit = e;
            }
            else if (e != "") {
                var tmp = {};
                if (isSpliting) {
                    tmp.split = { delim: lastSplit, str: e };
                }
                else {
                    tmp.str = e;
                }
                console.log(tmp);
                para.push(tmp);
            }
        }, this);

    }

    //console.log(para);

}

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

    rlt = p.split(listSplit)
    if (rlt.length > 2) {
        var l = {};
        l.delim = rlt[1];
        l.list = [];
        for (var i = 2; i < rlt.length; i += 2) {
            l.list.push(rlt[i]);
        }
        console.log("List: " + l.delim + "\n-- " + l.list.join("-- "));
        return;
    }

    rlt = code.exec(p);
    if (rlt) {
        console.log("PPara: " + rlt[1] + "\n" + rlt[2]);
        return;
    }

    parseContent(p);
}

function main(params) {
    data = data.replace(/\r\n/, "\n");
    data = data.split(preSplit);

    for (var i = 0; i < data.length; i++) {
        var d = data[i];
        if (preSplit.test(d)) {
            console.log("=====================");
            parse(d);
        }
        else {
            var paras = d.split(paragraph);
            paras.forEach(function (e) {
                if (spaceData.test(e)) return;
                console.log("=====================");
                parse(e);
            }, paras);
        }
    }
}

main(data);

//paragraph.match()
