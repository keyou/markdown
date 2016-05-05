console.log("markdown.js");

var fs = require("fs");
var data = fs.readFileSync("sample.md", "utf-8");

//var md = require("markdown");
//var html = md.parse(data);

var preSplit = /\n*(`{3,}.*\n[\S\s]*?\n`{3,})\n*/g; // presplit

var codeRgx = /\n*`{3,}(.*)\n([\S\s]*)?\n`{3,}\n*/g; // code 
var paragraph = /\n(?:\s*\n)+|  \n(?:\s*\n)*/g; // paragraph
var titleRgxs = [/^\s*#{1,6}\s*([\S\s]*)$/, /^\s*([\S\s]*?)\n[-=]{4,}\s*$/]; // title
var listRgx = /^([\*>])\.{0,1} (.*(?:\n(?!\1).+)*)$/mg;// list
var sortListRgx = /^(\d)\.{0,1} (.*(?:\n(?!\d).+)*)$/mg;// sort list
//var listSplit = /^\s*([\da-zA-Z\*>])\.{0,1} /m;

var styleRgx = /([_*`]{1,2})(.*?[^\\\n])\1/mg; // inlines
var styleSplit = /^[_*`]{1,2}$/;

var linkRgx = /\[([^\[\]]*)\](\((?:[^\(\)]|\(.*?\))*?\)|\[[^\[\]]*\])/mg;

var refRgx = /^\s*\[(.*?)\]:\s*(.*)\s*$/mg;

var spaceData = /^\s*$/;

function parseStyle(p) {
    var style = [];
    var rlt;
    
    while((rlt = linkRgx.exec(p))){
        style.push({type:"link",index:rlt.index,length:rlt[0].length});
        console.log("Link: "+rlt[0]);
    }
    
    
    while((rlt = styleRgx.exec(p))){
        style.push({type:"css",index:rlt.index,length:rlt[0].length});
        console.log("Style: "+rlt[1]+" "+rlt[2]);
    }
    
    while((rlt = refRgx.exec(p))){
        style.push({type:"ref",index:rlt.index,length:rlt[0].length});
        console.log("Ref: "+rlt[1]+" "+rlt[2]);
    }
    
    //console.log(para);
    return style;
}

function parse2Json(p) {
    var pa ={};
    var isOK = false;
    
    console.log("_______"+p.substr(0,20));
    
    var rlt = p.match(titleRgxs[0]);
    if (!isOK&&rlt) {
        console.log("Title: " + rlt[1]);
        pa.type = "title";
        pa.data = rlt[1]; 
        pa.style = parseStyle(rlt[1]);
        isOK = true;
    }

    rlt = p.match(titleRgxs[1]);
    if (!isOK&&rlt) {
        console.log("Title: " + rlt[1]);
        pa.type = "title";
        pa.data = rlt[1]; 
        pa.style = parseStyle(rlt[1]);
        isOK = true;
    }
    
    rlt = listRgx.test(p);
    if(!isOK&&rlt){
        pa.type = "list";
        pa.data = [];
        listRgx.lastIndex = 0;
        while((rlt = listRgx.exec(p))){
            console.log("List: "+rlt[1]+" "+rlt[2]);
            var tmp = {};
            tmp.key = rlt[1];
            tmp.value = rlt[2];
            tmp.style = parseStyle(rlt[2]);
            pa.data.push(tmp);
        }
        isOK = true;
    }

    rlt = sortListRgx.test(p);
    if(!isOK&&rlt){
        pa.type = "sortlist";
        pa.data = [];
        listRgx.lastIndex = 0;
        while((rlt = sortListRgx.exec(p))){
            console.log("SortList: "+rlt[1]+" "+rlt[2]);
            var tmp = {};
            tmp.key = rlt[1];
            tmp.value = rlt[2];
            tmp.style = parseStyle(rlt[2]);
            pa.data.push(tmp);
        }
        isOK = true;
    }

    
    rlt = codeRgx.exec(p);
    if (!isOK&&rlt) {
        console.log("Code: " + rlt[1] + "\n" + rlt[2]);
        pa.type = "code";
        pa.data = rlt[2];
        pa.lan = rlt[1];
        isOK = true;
    }
    
    if(!isOK){
        pa.type = "plain";
        pa.data = p;
        pa.style = parseStyle(p);
    }

    console.info(pa);
    return pa;
}

function parseHtml(data,styles) {
    styles.sort(function(l,r){return l.index>r.index?1:-1;});
    for (var i = 0; i < styles.length; i++) {
        var style = styles[i];
        switch(style.type){
            case "link":
            break;
            case "css":
            break;
            case "ref":
            break;
        }
    }
    
}

function json2Html(p) {
    var pHtml = "";
    if(p.type == "title"){
        pHtml += "<h1>"+parseHtml(p.data,p.styles)+"</h1>";
    }
    
    return pHtml;
}

function main(params) {
    data = data.replace(/\r\n/, "\n");
    data = data.split(preSplit);

    for (var i = 0; i < data.length; i++) {
        var d = data[i];
        if (preSplit.test(d)) {
            console.log("=====================");
            parse2Json(d);
        }
        else {
            var paras = d.split(paragraph);
            paras.forEach(function (e) {
                if (spaceData.test(e)) return;
                console.log("=====================");
                parse2Json(e);
            }, paras);
        }
    }
}

main(data);

//paragraph.match()
