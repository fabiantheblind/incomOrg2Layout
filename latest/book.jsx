﻿// book.jsx// this should generate a tiny a5 book from all the projekts// needs dumbrunpages by dave saunders// Copyright (C) 2012 Fabian "fabiantheblind" Morón Zirfas// http://www.the-moron.net// http://fabiantheblind.info/// info [at] the - moron . net// This program is free software: you can redistribute it and/or modify// it under the terms of the GNU General Public License as published by// the Free Software Foundation, either version 3 of the License, or// any later version.// This program is distributed in the hope that it will be useful,// but WITHOUT ANY WARRANTY; without even the implied warranty of// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the// GNU General Public License for more details.// You should have received a copy of the GNU General Public License// along with this program.  If not, see http://www.gnu.org/licenses/#include "db.json"#include "utility.jsx"#include "db_utils.jsx"#include "colors.jsx"#include "document.jsx"#include "styles.jsx"#include "weblinks.jsx"var meta = new Object();	meta.db = data;// this comes from the included db.json	meta.DEBUG = false; // this is for debugging	// this is for quicker editing 	// in the final render switch in the overlay and the image place	meta.flsFolder = null;// the folder for the images	meta.sortedFiles = null;//~	 meta.Masterframe = null;	db_sort_by_starttime();	db_remove_firstelement();// removes old junk	db_build_imageList();    util_getfilesFolder();    meta.sortedFilesbyId = db_files_lists_by_id();    meta.highlite = util_build_highliteList();	meta.stats = db_build_TextStats(); // look into db_utils.jsx    // now some sizes    meta.imgGutter = 5;    meta.gutter = meta.imgGutter;        meta.left = 12.7;	meta.right = 12.7;	meta.top = 12.7;	meta.bottom = 23;                  // this is DIN A5    meta.pw = 148; // this will hold the page width	meta.ph = 210; // this will hold the page width          meta.textColumnCount = 8;        meta.imgW = ((meta.pw - (meta.left + meta.right)) - meta.gutter*7) / 8;//25; // the image sizes	meta.imgH = meta.imgW;var counter = new Window("palette");counter.prompt = counter.add("statictext",[0,0,200,20]);    counter.show();    main();    counter.close();function main(){    var d = app.documents.add(); //build a basic document	colors_builder(d);	styles_builder(d); // build some paragrph styles    doc_build (d,true,false);// build the document    build_master_pages (d);    	util_getfilesFolder();// opens a prompt and lets the user choose a folder    // now when you use place() write this    // it will give you the file with the folder you need    /*    				meta.flsFolder.fsName + "/" + util_checkFileType(meta.sortedFiles[iter].filename)                */  var p = d.pages.item(0);// finally - get the first page//~ 	p.appliedMaster = d.masterSpreads.item(0);// apply the masterspread      //~ $.writeln (p.marginPreferences.columnsPositions.length);        for(var i in meta.highlite){        counter.prompt.text = "in meta higlite id: "+meta.highlite[i].id + " number: " + String(i);        process_one_projekt(d,meta.highlite[i].id);        }              d.documentPreferences.facingPages = true;      	text_takeOutTheTrash(d); // This removes html formatting	text_grepReformatting(d); // this removes some things and adds new paragraphs for the important projects    text_FormatParagraphs(d);    text_fix_last_line (d);    find_hyperlinks();    remove_empty_textframes(d);    remove_empty_pages(d);    imagePage_to_leftHandPage(d);return 0;    }// end of mainfunction build_master_pages(doc){    var pagina = doc.paragraphStyles.add({name:"pagina",        pointSize:10,        appliedFont:"DejaVu Serif	Book",        justification:Justification.CENTER_ALIGN        });    var msp1 = doc.masterSpreads.item(0).pages.item(0);// edit the masterspreads        var y1 = (meta.ph - (meta.bottom)) +meta.gutter;    var x1 =  meta.left;    var y2 = y1 + 13;    var x2 = meta.right;    var bounds = [y1,x1,y2,x2];        msp1. textFrames.add({geometricBounds:bounds});    msp1.contents = SpecialCharacters.autoPageNumber;    msp1.paragraphs.everyItem().appliedParagraphStyle = pagina;                var msp2 = doc.masterSpreads.item(0).pages.item(1);//edit the other masterspred        msp2. textFrames.add({geometricBounds:bounds});    msp2.contents = SpecialCharacters.autoPageNumber;    msp2.paragraphs.everyItem().appliedParagraphStyle = pagina;        }function reset_activeView(page){         app.activeWindow.activePage = page;              app.activeWindow.zoomPercentage = 50;        }   // found here   // http://forums.adobe.com/message/3281020#3281020function remove_empty_textframes(doc){       var myStories = doc.stories.everyItem().getElements();for (i = myStories.length - 1; i >= 0; i--){       counter.prompt.text = "removing empty textframes";    var myTextFrames = myStories[i].textContainers;        for (j = myTextFrames.length - 1; j >= 0; j--)    {        reset_activeView(myTextFrames[j].parentPage);        if (myTextFrames[j].contents == ""){            myTextFrames[j].remove();        }    }    }    }    // now remove empty pages found here    // http://forums.adobe.com/message/2401657#2401657function remove_empty_pages(doc){                  counter.prompt.text = " in remove emtpy pages";    var pag= doc.pages;for(var i=pag.length-1; i>=0; i--){    reset_activeView (pag[i]);    if(pag[i].pageItems.length==0&&pag[i].guides.length==0){                              counter.prompt.text = " pages" + String(i);        pag[i].remove();        }    }    }function process_one_projekt(doc , id){                                    counter.prompt.text = "processing project" + id;// images on top off projekt           var pr_files = get_files_from_project_byID (id);      if(pr_files != null && pr_files.length > 0){   var y1 = meta.left;   var x1 = meta.top;   var page = doc.pages.add();   page.label = "images";   count = 0;    for(var i = 0; i < pr_files.length; i ++){                counter.prompt.text = "placing " + pr_files[i].filename;       var y2 = y1 + meta.imgH;       var x2 = x1 + meta.imgW;       var oval = page.ovals.add({geometricBounds:[y1,x1,y2,x2]});       oval.strokeWeight = 2;       oval.strokeColor = id+"";       try{       oval.place(meta.flsFolder.fsName + "/" + util_checkFileType(pr_files[i].filename));        }catch(e){           oval.place(meta.flsFolder.fsName + "/" + "error.jpg");                        }                util_image_tint_and_fit(id,oval);                make_button_with_url(oval,pr_files[i].preview,id);       count++;       x1 = x2 + meta.gutter;       if(count%8 == 0){//~            alert(count%8);           y1 = y2 + meta.gutter/2;           x1 = meta.left;                      }              }          counter.prompt.text = "place text";        var textpage = doc.pages.add();//~      doc.viewPreferences.rulerOrigin = RulerOrigin.spreadOrigin          var bnds = getBounds(doc, textpage);//~      alert(bnds);     var tf = textpage.textFrames.add({geometricBounds:getBounds (doc, textpage)});var pr = get_project_by_id (id);		var dt1 = util_iso_to_datim(pr.datetimeStart);		var dt2 = util_iso_to_datim(pr.datetimeEnd);		var dt = dt1.getFullYear() + " "+dt1.getMonth() 		+" - " + dt2.getFullYear() + " "+dt2.getMonth() ;        		text_add_and_format(tf,"id: "+ pr.id+" ","id","id",pr, id,null);		text_add_and_format(tf,"timespan: " + dt + "","h2","id",pr, id,null);		text_add_and_format(tf,pr.title+"","h1","title",pr, id,null);						try{			text_add_and_format(tf,pr.workspace.title+"","h1","title",pr, id,null);			}catch(e){}				text_add_and_format(tf, pr.text,"body","text",pr, id,null);         //~          tf.geometricBounds = bnds;              counter.prompt.text = "processing posts";    for(var j = 0; j < pr.posts.length;j++){       			text_add_and_format(tf,pr.posts[j].titel,"h2","post title",pr, id ,pr.posts[j].id);			text_add_and_format(tf,pr.posts[j].text + "\n","body","post text",pr, id,pr.posts[j].id);       }//~         // now the dumbRunPages by dave saunders               counter.prompt.text = "dumb run pages";    DumbRunPages (doc, tf.parentStory);        }              counter.prompt.text = "end of one project";  }function imagePage_to_leftHandPage(doc){    for(var i = 0; i < doc.pages.length; i++){        var p = doc.pages.item(i);    reset_activeView (p);    if((p.label.match("images"))){        if(p.side == PageSideOptions.rightHand){                    $.writeln("image page named: " + p.name +" on the right hand side");           var newPage =  doc.pages.add(LocationOptions.BEFORE , p);           newPage.label = "stopper";            i = 0; // do this until we dont have any of these pages on the right side        }        }    } //close i loopfor(var j = 0; j < doc.pages.length;j++){    var cp  = doc.pages.item(j);     if((cp.label.match("stopper"))){        $.writeln("stopper page named: " + cp.name);                if(doc.pages.item(j+1).textFrames.length > 0){            var ntf = doc.pages.item(j+1).textFrames[0];        ntf.move(cp);        ntf.geometricBounds = getBounds (doc, cp);         }        }}}function DumbRunPages(theDoc, theStory) {  	// What makes this "dumb" is that default master pages are used.  	var uRuler = theDoc.viewPreferences.rulerOrigin;  	theDoc.viewPreferences.rulerOrigin = RulerOrigin.spreadOrigin;  	while (theStory.textContainers[theStory.textContainers.length-1].overflows) {  		/* 		// Original: Seite nach der letzten Dokumentseite einfügen 		theDoc.documentPreferences.pagesPerDocument = theDoc.documentPreferences.pagesPerDocument + 1;  		var backPage = theDoc.pages[-1]; 		*/ 		 		//alternativ: Seite nach der letzten Textrahmenseite einfügen 		var backPage = theDoc.pages.add();  		 		app.activeWindow.activePage = backPage;  		backPage.appliedMaster = theDoc.pages[-2].appliedMaster;  		var myPbounds = backPage.bounds;  		var myNewTF = backPage.textFrames.add();  		if ((backPage.name % 2 == 1) || (!theDoc.documentPreferences.facingPages)) {  			myNewTF.geometricBounds =   			[myPbounds[0] + backPage.marginPreferences.top,   			myPbounds[1] + backPage.marginPreferences.left,   			myPbounds[2] - backPage.marginPreferences.bottom,   			myPbounds[3] - backPage.marginPreferences.right];  		} else {  			myNewTF.geometricBounds =   			[myPbounds[0] + backPage.marginPreferences.top,   			myPbounds[1] + backPage.marginPreferences.right,   			myPbounds[2] - backPage.marginPreferences.bottom,   			myPbounds[3] - backPage.marginPreferences.left];  		}  		myNewTF.itemLayer = theStory.textContainers[theStory.textContainers.length-1].itemLayer;  		myNewTF.previousTextFrame = theStory.textContainers[theStory.textContainers.length-1];  //~ 		myNewTF.textFramePreferences.textColumnCount = backPage.marginPreferences.columnCount;  //~ 		myNewTF.textFramePreferences.textColumnGutter = backPage.marginPreferences.columnGutter;  		if (myNewTF.characters.length == 0){  			theDoc.viewPreferences.rulerOrigin = uRuler;  			alert("Permanently overset"); // This indicates a permanent overset condition so break out of loop              break;        }  	}  	theDoc.viewPreferences.rulerOrigin = uRuler;  } function get_project_by_id(id){    var result;    for(var i in meta.db.projects){           if(id == meta.db.projects[i].id){                    result = meta.db.projects[i];        break;            }                }    return result;    }    // get all the file  objects with their infos    // by their id    // returns sometihing like this//~     {"filename": "image.jpg",//~ 	"date":[ISO DATE],//~     "id":0,//~     "text":"some text or nothing",//~     "type":"project", // could also be year or link or pdf...//~     "tint":true,//~     "preview":"http://incom.org/projekt/0"});	//~ 			  }    function get_files_from_project_byID(id){            var result;        for(var i in meta.sortedFilesbyId){                if(id == meta.sortedFilesbyId[i].id){                    result = meta.sortedFilesbyId[i].files;        break;            }        }        return result;    }function text_add_and_format(tf,content,car,type ,pr, id,postID){				var tempTF = tf.parentPage.textFrames.add({geometricBounds:[				meta.ph - 100, meta.left, meta.ph, meta.left+100]});			  	// from here on it is some kind of "manual" selection	//what to edit and highlite in the text			  	if(util_checkhighlite (id) == true){	//	// this is project White Noise	//var res = "";	if(postID == 17135 && type.match("post text")){	var txt = content;		res = text_tweakNoiseText(txt);		tempTF.contents = text_insertWithNL(res,type);		tempTF.paragraphs.everyItem().applyCharacterStyle(		app.activeDocument.characterStyles.item("whitenoise 1173"));				}else{				  				  		res = content;		tempTF.contents =   text_insertWithNL(res,type);		try{			tempTF.paragraphs.everyItem().applyCharacterStyle(			tempTF.parent.parent.characterStyles.item(car + " "+ id)			);            		}catch(e){alert(car + "\n" + e );}                tempTF.paragraphs.everyItem().leading = 12;    	}// close else		tempTF.paragraphs.everyItem().fillTint = 100;	}else{		//		// this is all the other projects//~         if(type.match("post text") || type.match("text")){//~ 		tempTF.contents = content;//text_insertWithNL(content,type);//~         }else{		tempTF.contents = content;//text_insertWithNL(content,type);            //~             }		            tempTF.paragraphs.everyItem().applyCharacterStyle(			app.activeDocument.characterStyles.item(car + " " +  id));        tempTF.paragraphs.everyItem().leading = 12;    		if(type.match("legend")){			tempTF.paragraphs.everyItem().fillTint = 100;	  		}	}	tempTF.previousTextFrame = tf;	tempTF.remove();}function text_tweakNoiseText(txt){var noiseTXT = new Array();var noiseVals = new Array();		noiseTXT = txt.split(",");	for(var n = 0; n < noiseTXT.length;n++){		var t = parseFloat(noiseTXT[n]);		noiseVals[n] = t.toFixed(10);		}	noiseVals.shift();		var str = "";	for(s = 0; s < noiseVals.length;s++){		if(noiseVals[s] >= 0 ){			str = str + "+" + noiseVals[s] + " \t ";		}else{			str = str  + noiseVals[s] + " \t ";		}	}return str;}function text_FormatParagraphs(doc){    var fTPref  = app.findTextPreferences;var cTPref = app.changeTextPreferences;		text_emptyFC();	// now loop thru the object to get all the greps	for(var j = 0;j < meta.db.projects.length;j++){        fTPref.appliedCharacterStyle = "h1 "+meta.db.projects[j].id;        cTPref.leading = 16;        if(util_checkhighlite (meta.db.projects[j].id)){        var res = doc.changeText();        }//~         alert(res);        text_emptyFC();	}	text_emptyFC();       	// now loop thru the object to get all the greps	for(var i = 0;i < meta.db.projects.length;i++){        fTPref.appliedCharacterStyle = "h2 "+meta.db.projects[i].id;        cTPref.leading = 16;                if(util_checkhighlite (meta.db.projects[i].id)){        var res = doc.changeText();        }//~         alert(res);        text_emptyFC();	}    	// now loop thru the object to get all the greps	for(var i = 0;i < meta.db.projects.length;i++){        fTPref.appliedCharacterStyle = "id "+meta.db.projects[i].id;        cTPref.leading = 12;                if(!util_checkhighlite (meta.db.projects[i].id)){        var res = doc.changeText();        }//~         alert(res);        text_emptyFC();	}         }function text_fix_last_line(doc){        for(var j = 0; j < doc.textFrames.length;j++){        tf = doc.textFrames.item(j);        for (var i  = 0; i < tf.paragraphs.length;i++){            if(tf.paragraphs.item(i).fillTint  == 100 && tf.paragraphs.item(i).characters.item(0).appliedCharacterStyle.name.match("body")){//~                     alert("found a fill");            tf.paragraphs.item(i).leading = 12;                    }                        }    }}function text_insertWithNL(txt,type){var lf = "<LF>";// we add this to the highlite projects to add a new line		if(type.match("legend") || type.match("id")){		return  txt;		}else{	return lf + txt;	};}function text_takeOutTheTrash(doc){var findGrepPref  = app.findGrepPreferences;var chngGrepPref = app.changeGrepPreferences;var findTextPref  = app.findTextPreferences;var chngTextPref = app.changeTextPreferences;	text_set_FindChange_opt();	text_emptyFC();		// this is housekeepingvar strings = new Array();	strings[0] = "</span>";	strings[1] = "<span>";	strings[2] = "<ol>";	strings[3] = "</ol>";	strings[4] = "<li>";	strings[5] = "</li>";	strings[6] = "\t";	strings[7] = "<cite>";	strings[8] = "</cite>";	strings[9] = "</ul>";	strings[10] = "<ul>";	strings[11] = "<..>";	strings[12] = "<...>";	strings[13] = "<.>";	strings[14] = "</p>";	strings[15] = "<p>";	strings[16] = "<p >";	strings[17] = "</p >";	strings[18] = "style=“color: #000000;“";	strings[19]  = "style=“text-decoration: underline;“";	strings[20]  = "style=“text-decoration: underline;“";	strings[21]  = "style=“text-align: left;“";	strings[22]  = "style=“text-align: right;“";	strings[23]  = "style=“text-align: center;“";	strings[24]  = "</span >";	strings[25]  = "<span >";	strings[26]  = "style=“color: #";	strings[27]  = "span ";	strings[28]  = ";“";		strings.push("<br />");	strings.push("<h1>");	strings.push("<h2>");	strings.push("<h3>");		strings.push("</h3>");	strings.push("</h1>");	strings.push("</h2>");	strings.push("<hr />");	strings.push("</em>");	strings.push("<em>");	strings.push("<strong>");	strings.push("</strong>");	for(var i = 0;i < strings.length;i++){		text_set_FindChange_opt();		findTextPref.findWhat = strings[i];		chngTextPref.changeTo = "";		doc.changeText();		text_emptyFC();	}	text_emptyFC();		// replace some html encoded characters	var replaceS = new Array();	replaceS.push({"fw":";amp","to":"&"});	replaceS.push({"fw":"amp;","to":"&"});//~ var replaceT = new Array();//~	 replaceT.push("&");//~	 replaceT.push("&");		for(var j = 0;j < replaceS.length;j++){		text_set_FindChange_opt();		findTextPref.findWhat = replaceS[j].fw;		chngTextPref.changeTo = replaceS[j].to;		doc.changeText();		text_emptyFC();	}}function text_grepReformatting(doc){	var fGPref  = app.findGrepPreferences;var cGPref = app.changeGrepPreferences;var greps_ = new Array();	// use json objects to keep it tidy	// fw is the find what	// to is the change to	greps_.push({   "fw":"  +"	  ,		"to":" "});	greps_.push({   "fw":"\r "	  ,		"to":"\r"});	greps_.push({   "fw":" \r"	  ,		"to":"\r"});	greps_.push({   "fw":"\t\t+"	,	  "to":"\t"});	greps_.push({   "fw":"\r\t"	 ,	   "to":"\r"});	greps_.push({   "fw":"\t\r"	 ,	   "to":"\r"});	greps_.push({   "fw":"\r\r+"	,	  "to":" ~7 "});	greps_.push({   "fw":"\r"	   ,		 "to":" ~7 "});	greps_.push({   "fw":"\n"	   ,		 "to":" ~7 "});	greps_.push({   "fw":"~b"	   ,		 "to":" ~7 "});	greps_.push({   "fw":"~7 ~7"	,	  "to":" ~7 "});	greps_.push({   "fw":" ~7  ~7 " ,   "to":" ~7 "});	greps_.push({   "fw":"<LF>"	 ,	   "to":"\r"});// this is my personal linefeed	greps_.push({   "fw":"<a\ href\=\"(.*?)\">"	 ,	   "to":" $1 "});// find link    greps_.push({   "fw":"alt\=\".*?\""	 ,	   "to":" "});// fand alternate       greps_.push({   "fw":"<img src\=\"(.*?)\"\ {0,3}/>"	 ,	   "to":" $1 "});// find img as html	greps_.push({   "fw":"</a>"	 ,	   "to":" "});// find end of href tag	greps_.push({   "fw":"\&hellip;"	 ,	   "to":"&"});// find & in html	greps_.push({   "fw":"\&quot;"	 ,	   "to":"\""});// find quotew in html    greps_.push({   "fw":"~7\ \ {2,3}"	 ,	   "to":""});// also to many    greps_.push({   "fw":"\ ~7\ \ ~7\ "	 ,	   "to":"\ ~7\ "});//to many paragraph signs    greps_.push({   "fw":"\ \ "	 ,	   "to":"\ "});// double spaces	text_emptyFC();	// now loop thru the object to get all the greps	for(var j = 0;j < greps_.length;j++){		fGPref.findWhat = greps_[j].fw;		cGPref.changeTo = greps_[j].to;		doc.changeGrep();		text_emptyFC();	}	text_emptyFC();}/** * this function takes out html trash  * */function text_set_FindChange_opt(){		text_emptyFC();	//Set the find options.	app.findChangeGrepOptions.includeFootnotes = true;	app.findChangeGrepOptions.includeHiddenLayers = false;	app.findChangeGrepOptions.includeLockedLayersForFind = false;	app.findChangeGrepOptions.includeLockedStoriesForFind = true;	app.findChangeGrepOptions.includeMasterPages = true;	}function text_emptyFC(){	//Clear the find/change grep preferences.	app.findGrepPreferences = NothingEnum.nothing;	app.changeGrepPreferences = NothingEnum.nothing;		//Clear the find/change text preferences.	app.findTextPreferences = NothingEnum.nothing;	app.changeTextPreferences = NothingEnum.nothing;}function text_find_HTML_tags(doc) {	text_set_FindChange_opt();//~ var findGrepPref  = app.findGrepPreferences;//~ var chngGrepPref = app.changeGrepPreferences;//~ 	var findTXTPref  = app.findTextPreferences;var chngTXTPref = app.changeTextPreferences;		text_emptyFC();	var easyTagToPS = new Array();	easyTagToPS[0] = "h1";	easyTagToPS[1] = "h2";//~ 	easyTagToPS[2] = "h3";//~ 	easyTagToPS[3] = "h4";//~ 	easyTagToPS[4] = "h5";//~ 	easyTagToPS[5] = "h6";	for(var i = 0; i < easyTagToPS.length; i++){			findGrepPref.findWhat = "<"+ easyTagToPS[i] + ">(.*?)</" + easyTagToPS[i] + ">";				var res = doc.findText();		res.appliedParagraphStyle = easyTagToPS[i];		chngGrepPref.changeTo = "$1\r";//~		 chngGrepPref.appliedParagraphStyle = easyTagToPS[i];//~ 		chngGrepPref.appliedCharacterStyle = doc.characterStyles.item(0);		doc.changeGrep();		text_emptyFC();	}}// the good old get bounds// its an adobe thingyfunction getBounds(doc, page){	var pw = doc.documentPreferences.pageWidth;	var ph = doc.documentPreferences.pageHeight	if(page.side == PageSideOptions.leftHand){		var myX2 = page.marginPreferences.left;		var myX1 = page.marginPreferences.right;	}	else{		var myX1 = page.marginPreferences.left;		var myX2 = page.marginPreferences.right;	}	var myY1 = page.marginPreferences.top;	var myX2 = pw - myX2;	var myY2 = ph - page.marginPreferences.bottom;	return [myY1, myX1, myY2, myX2];}