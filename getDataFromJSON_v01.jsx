﻿// the db jason file contains an object called data// you can inspect the object like this// alert(data.toSource()); #include "db.json"var txt = "\n";var sel = "\n";var prjcts = new Array();for(var i = 0; i < data.projects.length; i++){    var p = data.projects[i];    txt = txt + "id: "+p.id+ " title: "+p.title +"\n";//~     if(p.id == 1362 ){//~     prjcts.push(p); //sel + p.toSource () + "\n";//~     }//~     if( p.id == 1173 ){//~     p2 = p; //sel = sel + p.toSource () + "\n";//~     }//~     if( p.id == 1754){//~     p3 = p; //sel = sel + p.toSource () + "\n";//~     }    if(p.id == 1362 || p.id == 1173 || p.id == 1754){    sel = sel + p.toSource () + "\n";     prjcts.push(p); //sel + p.toSource () + "\n";    }    }alert(txt);//alert(prjcts[2].toSource());//var d = app.documents.add();// a new doc//d.documentPreferences.pageWidth = 841;//alert(txt);//alert(sel);