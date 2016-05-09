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