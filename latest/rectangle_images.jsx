﻿// rectangle_images.jsx// Copyright (C) 2012 Fabian "fabiantheblind" Morón Zirfas// http://www.the-moron.net// http://fabiantheblind.info/// info [at] the - moron . net// This program is free software: you can redistribute it and/or modify// it under the terms of the GNU General Public License as published by// the Free Software Foundation, either version 3 of the License, or// any later version.// This program is distributed in the hope that it will be useful,// but WITHOUT ANY WARRANTY; without even the implied warranty of// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the// GNU General Public License for more details.// You should have received a copy of the GNU General Public License// along with this program.  If not, see http://www.gnu.org/licenses/#include "db.json"#include "utility.jsx"#include "db_utils.jsx"#include "colors.jsx"#include "document.jsx"#include "styles.jsx"#include "weblinks.jsx"var meta = new Object();	meta.db = data;// this comes from the included db.json	meta.prjList = [1173, 1362, 1754]; // the projects to highlite	meta.highlite = [	{"id":0, "name":"0","col":[255,255,255]},	{"id":1173,"name":"1173","col":[153,51,255]},	{"id":1362,"name":"1362","col":[102,153,255]},	{"id":1754,"name":"1754","col":[51,204,204]}	];		meta.DEBUG = false; // this is for debugging		// this is for quicker editing 	// in the final render switch in the overlay and the image place	meta.placeImages = true;   	meta.addImageOverlay = true;	meta.skipImages = false;    meta.colorsonly = false;	meta.flsFolder = null;// the folder for the images//~	 meta.allImages = null;// the images	meta.imgW = 25; // the image sizes	meta.imgH = 25;   //~	 meta.step = 1; // the step for selecting the images	// these are the margins	meta.left = 50;	meta.right = 50;	meta.top = 50;	meta.bottom = 50;	meta.textColumnCount = 20;	// this will be filled with data from the db.json	// sorted by startdate	meta.sortedFiles = null;   //~	 meta.Masterframe = null;	db_sort_by_starttime();	db_remove_firstelement();// removes old junk	db_build_imageList();	meta.cCount = 80;    // calculate the gutter depending on how many images per column    meta.gutter = ((meta.pw - (meta.left + meta.right)) - (meta.imgW*80)) / 79;    meta.pw = Math.round(Math.sqrt(meta.sortedFiles.length)) * meta.imgW + (meta.imgW*2); // this will hold the page width	meta.ph = meta.pw; // this will hold the page width	main();// everything happens in here// you need a function to cancel a scriptfunction main(){var d = app.documents.add(); //build a basic document	colors_builder(d);    if(meta.colorsonly)return;	styles_builder(d); // build some paragrph styles//~ return;	    doc_build (d);// build the document    	image_loadFiles();// opens a prompt and lets the user choose a foldervar p = d.pages.item(0);// finally - get the first page	p.appliedMaster = d.masterSpreads.item(0);// apply the masterspread   	if(meta.DEBUG==true)$.writeln (meta.sortedFiles.length);// this is just debug   var ovals  = new Array();// an array for the ovalsvar count = 0;var w = meta.imgW;for(var y1 = w; y1 < meta.ph -w; y1+=w){        for(var x1 = w; x1 < meta.pw -w; x1+=w){                        var rect = p.rectangles.add({geometricBounds:[y1,x1,y1+w,x1+w],strokeWeight:2,strokeColor:d.swatches.item(2)});// add a rectangle to the page            try{              rect.place(meta.flsFolder.fsName + "/" + 							util_checkFileType(							meta.sortedFiles[count].filename							));        // fit the image to the frame//~         cr.fit(FitOptions.CONTENT_TO_FRAME);    }catch(e){//~       if(meta.DEBUG) alert( meta.sortedFiles[s].filename + "\n" + e);				 // so got an error place the error imgage instead				 rect.place(				meta.flsFolder.fsName + "/" +"error.jpg"				);                }         image_tint_and_fit (count, rect);     make_button(rect, count);               count++;          if(count >= meta.sortedFiles.length){              break;              }     }                       if(count >= meta.sortedFiles.length){              break;              }    }text_build_headline (d, p);text_make_hyperlinks();}function text_build_headline(doc,page){    doc.paragraphStyles.item("head").pointSize = 13;    doc.paragraphStyles.item("head").justification = Justification.RIGHT_ALIGN;        var x1 = meta.left;    var y1 = meta.ph - (meta.bottom - 5 );    var x2 = meta.pw - meta.right;    var y2 = meta.ph;     var tf = page.textFrames.add({geometricBounds:[y1,x1,y2,x2]});     var dt = new Date();    tf.contents = "6479: Fabian Morón Zirfas\n"+    "build on: " + dt.getFullYear() + "/"+dt.getMonth() + 1 + "/"+dt.getDate() +    "\nIn "+db_get_timespan ()+" days I made " + db_build_stats (doc) +".\n " +    " get the code over there http://fabiantheblind.github.com/incomOrg2Layout/";    tf.paragraphs.everyItem().appliedParagraphStyle = doc.paragraphStyles.item("head");        }function image_tint_and_fit(s,oval){try{    if(meta.sortedFiles[s].tint == true){        oval.images.item(0).fillColor = meta.sortedFiles[s].id + "";        }    }catch(e){        if(meta.DEBUG)$.writeln("Error while tintig the image \n"+e);}    oval.fit(FitOptions.FILL_PROPORTIONALLY);// center it    oval.fit(FitOptions.CENTER_CONTENT);// center it			try{// we have to check if the images are printable.// if the effectivePpi is under 280 we rescale the image// warning this gets overritten if we use the fiting laterif(meta.DEBUG) $.writeln(ovals[s].images.item(0).effectivePpi);// if the images are to small to printif(oval.images.item(0).effectivePpi[0] < 280 && util_checkhighlite (meta.sortedFiles[s].id) != true){    oval.images.item(0).horizontalScale = 24;				oval.images.item(0).verticalScale = 24;  	oval.images.item(0).fit(FitOptions.CENTER_CONTENT);// center it again	}}catch(e){ }} // END TINTfunction image_loadFiles(){		// define the folder and the filetype          var theFolder = Folder("~/Documents/Dropbox/incom2layoutFilesGrey");//Folder.selectDialog ("Choose the FOLDER to import the images from");      //~	 alert(theFolder);	// if the user cancels the folder dialog	 // cancel the script	if(!theFolder){		return;// this cancels the whole function main \(\)		}	var theFileType = "*.*";// only use tif files could also be jpg	// get all images into an array	var temp = null;	try{	temp = theFolder.getFiles(theFileType);	   	   }catch(e){		   alert("Error with this\n" +e);		   }// end catch      var allImages = temp;	if((allImages == "")||(allImages == null) ){		if(meta.DEBUG)alert("There aare no images");		return;	   	   }	meta.flsFolder = theFolder;// to get them all everywhere	meta.allImages = allImages;	}