﻿var doc = app.activeDocument;imagePage_to_leftHandPage (doc);function imagePage_to_leftHandPage(doc){    for(var i = 0; i < doc.pages.length; i++){        var p = doc.pages.item(i);        		app.activeWindow.activePage = p;              app.activeWindow.zoomPercentage = 50;    if((p.label.match("images"))){        if(p.side == PageSideOptions.rightHand){           var newPage =  doc.pages.add(LocationOptions.BEFORE , p);           newPage.label = "stopper";//~             remove_empty_pages (doc);            i = 0; // do this until we dont have any of these pages on the right side        }        }    } for(var j = 0; j < doc.pages.length;j++){    var cp  = doc.pages.item(j);     if((cp.label.match("stopper"))){        alert("stopper page named: " + cp.name);                if(doc.pages.item(j+1).textFrames.length > 0){            var ntf = doc.pages.item(j+1).textFrames[0];        ntf.move(cp);         }        }}}