﻿// the db jason file contains an object called data// you can inspect the object like this// alert(data.toSource()); #include "db.json"var txt = "\n";var sel = "\n";var prjcts = new Array();data.projects.sort(custom_sort);data.projects.shift();var ids = new Array();for(var i = 0; i < data.projects.length; i++){    var p = data.projects[i];    txt = txt + "id: "+p.id+ " title: "+p.title + " time: "+ p.datetimeStart+"\n";    ids.push(p.id);//~     if(p.id == 1362 ){//~     prjcts.push(p); //sel + p.toSource () + "\n";//~     }//~     if( p.id == 1173 ){//~     p2 = p; //sel = sel + p.toSource () + "\n";//~     }//~     if( p.id == 1754){//~     p3 = p; //sel = sel + p.toSource () + "\n";//~     }//~     if(p.id == 1362 || p.id == 1173 || p.id == 1754){//~     sel = sel  + "id: "+p.id+ " title: "+p.title +"\n";//~      prjcts.push(p); //sel + p.toSource () + "\n";//~         }    }           //~ alert(dt);alert(ids);//alert(prjcts[2].toSource());//var d = app.documents.add();// a new doc//d.documentPreferences.pageWidth = 841;//alert(txt);//~ alert(sel);// found here// http://stackoverflow.com/questions/3859239/sort-json-by-datefunction custom_sort(a, b) {    return new Date(iso_to_datim(a.datetimeStart)).getTime() - new Date(iso_to_datim(b.datetimeStart)).getTime();}// found here// http://www.topsoft.at/pstrainer/pstrainer.phpfunction iso_to_datim(iso) {var d=null;var len=iso.length;if(len>=19) {var hh=parseInt(iso.substr(11,2),10);var mi=parseInt(iso.substr(14,2),10);var ss=parseInt(iso.substr(17,2),10);}else {var hh=0; var mi=0; var ss=0;}if(len>=10) {var yy=parseInt(iso.substr(0,4),10);var mo=parseInt(iso.substr(5,2),10)-1;var dd=parseInt(iso.substr(8,2),10);d = new Date(yy,mo,dd,hh,mi,ss);}else {d=new Date();}return d;}