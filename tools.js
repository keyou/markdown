String.prototype.format= function(){
       var args = arguments;
       return this.replace(/\{(\d+)\}/g,function(s,i){
         return args[i];
       });
}

String.prototype.startWith=function(str){     
  var reg=new RegExp("^"+str);     
  return reg.test(this);        
} 
 
String.prototype.endWith=function(str){     
  var reg=new RegExp(str+"$");     
  return reg.test(this);        
}

String.prototype.firstNotSpaceChar=function(){     
  var rgx = /^\s*(\S)/;
  var rlt = rgx.exec(this);
  if(rlt){
    return rlt[1];
  }
  return rlt;
}