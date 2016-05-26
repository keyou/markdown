/************************************************ 
     
    file:       markdown.js
    author:     keyou
    date:       2016/5/10
    mission:    parse markdown file.
    license:    MIT License
    
*************************************************/

(function (expose) {

    var titleRgx = /^(#{1,7})\s+([\S\s]*)$/m;

    expose.parse = function parse(data) {
        data = data.replace(/\r\n/, '\n');
        var lines = data.split(/\n/);
        var desList = ['start'];
        var rltData = '';
        var rlt;

        var line, lastDes, firstChar, firstNotSpaceChar;

        for (var i = 0; i < line.length; i++) {
            line = line[i];
            lastDes = desList.slice(-1)[0];
            firstChar = line.charAt(0);
            firstNotSpaceChar = line.firstNotSpaceChar();
            titleRgx.lastIndex = 0;
            if (lastDes === 'code') {
                if (firstChar === '`' && line.startWith('```')) {
                    rltData += '}';
                    desList.pop();
                }
                else {
                    rltData += line + '\n';
                }
            }
            else if (firstChar === '#' && (rlt = titleRgx.exec(line))) {
                rltData += ''.
            }
            else if(d){
                
            }



        }

    };


})(function () {
    if (typeof exports === "undefined") {
        window.markdown = {};
        return window.markdown;
    }
    else {
        return exports;
    }
} ());