﻿/*** @@@BUILDINFO@@@ lengthOfTexts.jsx !Version! Sat Jan 21 2012 15:07:32 GMT+0100*///lengthOfTexts.jsx// this script builds an index//// not based on but this helped on the first steps // InsertMultipleImages.js by Brian Reyman// http://www.adobe.com/cfusion/exchange/index.cfm?event=extensionDetail&extid=1046817// and theImageGrid.jsx by fabiantheblind// https://raw.github.com/fabiantheblind/theGrids/master/imageGrid/theImageGrid.jsx// Copyright (C) 2011 Fabian "fabiantheblind" Morón Zirfas// http://www.the-moron.net// http://fabiantheblind.info/// info [at] the - moron . net// This program is free software: you can redistribute it and/or modify// it under the terms of the GNU General Public License as published by// the Free Software Foundation, either version 3 of the License, or// any later version.// This program is distributed in the hope that it will be useful,// but WITHOUT ANY WARRANTY; without even the implied warranty of// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the// GNU General Public License for more details.// You should have received a copy of the GNU General Public License// along with this program.  If not, see http://www.gnu.org/licenses/#include "db.json"#include "utility.jsx"#include "db_utils.jsx"#include "colors.jsx"#include "document.jsx"#include "styles.jsx"#include "weblinks.jsx"var meta = new Object();	meta.db = data;// this comes from the included db.json	meta.DEBUG = false; // this is for debugging	// this is for quicker editing 	// in the final render switch in the overlay and the image place	meta.flsFolder = null;// the folder for the images	meta.sortedFiles = null;//~	 meta.Masterframe = null;	db_sort_by_starttime();	db_remove_firstelement();// removes old junk	db_build_imageList();     util_getfilesFolder();// if you want to write your own scripts. copy all above into your new file// than have a look in to the object meta with the function prop() below.// you can now add and remove objects from meta. e.g.    	meta.highlite = build_highliteList();	meta.stats = get_length_of_text();    meta.fileStats = db_build_file_stats();	meta.imgW = 25; // the image sizes	meta.imgH = 25;   	meta.pw = 2000; // this will hold the page width	meta.ph = 841; // this will hold the page width	// these are the margins	meta.left = 50;	meta.right = 50;	meta.top = 50;	meta.bottom = 50;        meta.gutter = 13;    // in meta.db.projects you find all the incom projects.// if you want to use your own projects contact memain();function main(){var d = app.documents.add(); // the docdoc_build(d,false); // make some doc stuffcolors_builder(d); // build the colors for the projectsstyles_builder(d);// build the character stylesvar p = d.pages.item(0); // first pagevar y1 = meta.top;// oint to start with the circlesvar x1 = meta.left;       var mastergrp = new Array();// a group that holds all the graphixcs for realigning// loop thr the projectsfor(var i in meta.db.projects){    var grp = new Array();// a group    var y2 = y1 + meta.imgH; // calc the lowr right    var x2 = x1 + meta.imgW;            var pr =meta.db.projects[i];            var oval = p.ovals.add({geometricBounds:[y1,x1,y2,x2]});        grp.push(oval);        oval.place(meta.flsFolder.fsName + "/" +     meta.db.projects[i].id + ".jpg");// place the project image        oval.strokeWeight = 0;        image_tint_and_fit (meta.db.projects[i].id, oval);// giv it the right color and fit the image to the circle        oval.label = pr.id;    // now mkae a textframe that holdsas the project title    var tf = p.textFrames.add({geometricBounds:[            y2+ meta.gutter*2,            x1 + meta.imgW/2,            y2 + 50,            x2+150+ meta.imgW/2]});        tf.contents = pr.title;        tf.paragraphs.everyItem().applyCharacterStyle(d.characterStyles.item("h1 "+ pr.id));        tf.fit(FitOptions.FRAME_TO_CONTENT);        grp.push(tf);//~         var ob = new Object();//~         ob.geometricBounds = [tf.geometricBounds[0]-1,tf.geometricBounds[1]-1,tf.geometricBounds[0],tf.geometricBounds[1]];//~         var gltxt = connect (oval, ob, pr.id);//~         gltxt.sendToBack();//~         grp.push(gltxt);    // rotate it by 45 degrees        var rotTM = app.transformationMatrices.add({counterclockwiseRotationAngle:-45 });// rotate (the 180 is for getting the line start upwards)		tf.transform(CoordinateSpaces.pasteboardCoordinates, AnchorPoint.LEFT_CENTER_ANCHOR, rotTM);    // loop thru the stats    for(var j in meta.stats){        // if the stats id matches the project id        if(meta.stats[j].id == meta.db.projects[i].id){            // if there is a workspace to the project            if(meta.db.projects[i].workspace != null){                // the coords of the smaller circle                var tx1 =  oval.geometricBounds[1];                var ty1 = oval.geometricBounds[0];                var tx2 = tx1 + 5;                var ty2 = ty1 + 5;                var ov2 = p.ovals.add({geometricBounds:[ty1,tx1,ty2,tx2]});                // shift him up                var shift = app.transformationMatrices.add({verticalTranslation:-100});// transform vertical                // and scale                var vrScale = app.transformationMatrices.add({verticalScaleFactor:1.5});// scale vertical with the factor 0.7 makes it smaller                var hrScale = app.transformationMatrices.add({horizontalScaleFactor:1.5});// scale horizontal with the factor 0.7 makes it smaller                    ov2.transform(CoordinateSpaces.pasteboardCoordinates, AnchorPoint.CENTER_ANCHOR, shift);                    ov2.transform(CoordinateSpaces.pasteboardCoordinates, AnchorPoint.CENTER_ANCHOR, vrScale);                    ov2.transform(CoordinateSpaces.pasteboardCoordinates, AnchorPoint.CENTER_ANCHOR, hrScale);                                        grp.push(ov2);// add to group                                        ov2.strokeWeight = 0;// some styling                    ov2.fillColor = d.swatches.item(pr.id+"");// the color for the project                var wsbttn = make_button_with_url(ov2,"http://incom.org/workspace/"+ meta.db.projects[i].workspace.id,pr.id);                grp.push(wsbttn);                // now make a textframe for the workspace title                var tfw = p.textFrames.add({geometricBounds:[                        ov2.geometricBounds[0] - 5,                        ov2.geometricBounds[1] + (ov2.geometricBounds[3] -ov2.geometricBounds[1])/2,                        ov2.geometricBounds[1],                        ov2.geometricBounds[3]+ 150]});                    // add the text                    tfw.contents = "workspace: "+meta.db.projects[i].workspace.title;                    tfw.paragraphs.everyItem().applyCharacterStyle(d.characterStyles.item("image ul "+ pr.id));                    tfw.fit(FitOptions.FRAME_TO_CONTENT);// fit it                    // rotate it by 45 degrees                var rot = app.transformationMatrices.add({counterclockwiseRotationAngle:45});// transform vertical                    tfw.transform(CoordinateSpaces.pasteboardCoordinates, AnchorPoint.LEFT_CENTER_ANCHOR, rot);                    grp.push(tfw);                }// end of workspace                          var factor = parseFloat ("1."+meta.stats[j].len);// need this trick for the scale             var vrScaleTM = app.transformationMatrices.add({verticalScaleFactor:factor});// scale vertical with the factor 0.7 makes it smaller            var hrScaleTM = app.transformationMatrices.add({horizontalScaleFactor:factor});// scale horizontal with the factor 0.7 makes it smaller            oval.transform(CoordinateSpaces.pasteboardCoordinates, AnchorPoint.LEFT_CENTER_ANCHOR, vrScaleTM);            oval.transform(CoordinateSpaces.pasteboardCoordinates, AnchorPoint.LEFT_CENTER_ANCHOR, hrScaleTM);            var bttn = make_button_with_url(oval,"http://incom.org/projekt/"+ pr.id,pr.id);            grp.push(bttn);            // if there are both connect them            if(oval != null && ov2 != null){                var gl = connect(oval,ov2,pr.id);                    gl.sendToBack();                    grp.push(gl);                    }                                      } // end if workspace                }// and of j          // now move the x coordiante        x1 = (oval.geometricBounds[3]) + meta.gutter;//~         x1 = x1 + meta.imgH + meta.gutter;        var groupedItems = p.groups.add(grp);// make a group        groupedItems.label = pr.id +""; // giv it a label        mastergrp.push(groupedItems);// push it to the master group        // garbadge collection        oval = null;        ov2 = null;        tf = null;        tfw = null;        gl = null;        }// end of i        var supergroup = p.groups.add(mastergrp);// another groupvar gb = supergroup.geometricBounds;// the size//  recalc the size of the page    d.documentPreferences.pageHeight = gb[2]-gb[0]+ meta.top + meta.bottom;    meta.ph = d.documentPreferences.pageHeight;// and store it in meta again        d.documentPreferences.pageWidth = groupedItems.geometricBounds[3]+ meta.left + meta.right;    meta.pw = d.documentPreferences.pageWidth;      // now move the group to the center    d.align(supergroup,   DistributeOptions.HORIZONTAL_CENTERS, AlignDistributeBounds.PAGE_BOUNDS);     d.align(supergroup,   DistributeOptions.VERTICAL_CENTERS, AlignDistributeBounds.PAGE_BOUNDS);     var tf = text_build_headline (d, p); // build the headline//~ for(var i = p.ovals.length -1 ; i > 0; i --){//~     try{//~     var bttn = make_button_with_url(p.ovals.item(i),"http://incom.org/projekt/"+ p.ovals.item(i).label,parseInt (p.ovals.item(i).label));//~     }catch(e){//~ alert(e);        //~         }//~     }}// END MAIN// look into db_utils.jsxfunction get_length_of_text(){    var list = db_build_TextStats();    return list;        }// tint and fit the imagefunction image_tint_and_fit(id,oval){                oval.images.item(0).fillColor = id + "";                oval.fit(FitOptions.FILL_PROPORTIONALLY);// center it                oval.fit(FitOptions.CENTER_CONTENT);// center it} // END TINT// in this case all the projects are in highlite// if not some text is smaller and greyfunction build_highliteList(){    var list = new Array();            list.push({"id":0, "name":"0","col":[255,255,255]});	        for(var i in meta.db.projects){        list.push({"id":meta.db.projects[i].id,"name":meta.db.projects[i].id+"","col":[255,255,255]});                }return list;        }function text_build_headline(doc,page){    doc.paragraphStyles.item("head").pointSize = 13;    doc.paragraphStyles.item("head").justification = Justification.RIGHT_ALIGN;        var x1 = meta.left;    var y1 = meta.ph - (meta.bottom - 5 );    var x2 = meta.pw - meta.right;    var y2 = meta.ph;     var tf = page.textFrames.add({geometricBounds:[y1,x1,y2,x2]});     var dt = new Date();    tf.contents = "6479: Fabian Morón Zirfas\n"+    "build on: " + dt.getFullYear() + "/"+dt.getMonth() + 1 + "/"+dt.getDate() +    "\nIn "+db_get_timespan ()+" days I made " + db_build_stats (doc) +".\n " +    " get the code over there http://fabiantheblind.github.com/incomOrg2Layout/";    tf.paragraphs.everyItem().appliedParagraphStyle = doc.paragraphStyles.item("head");        return tf;    }// connect the circles // found here // http://www.hilfdirselbst.ch/foren/Zwei_Kreise_mit_einer_Linie_orthogonal_verbinden_P486512.htmlfunction connect(c1,c2,id) { 	 	var gb = c1.geometricBounds; 	var r1 = (gb[3]-gb[1])/2; 	var x1 = gb[1]+r1; 	var y1 = gb[0]+r1; 	 	gb = c2.geometricBounds; 	var r2 = (gb[3]-gb[1])/2; 	 	var x2 = gb[1]+r2; 	var y2 = gb[0]+r2;  	var gl = c1.parent.graphicLines.add(); 	gl.paths[0].pathPoints[0].anchor  = [x1,y1]; 	gl.paths[0].pathPoints[1].anchor = [x2,y2];     gl.paths[0].pathPoints[0].leftDirection = [x1- 100,y1]    //~  gl.paths[0].pathPoints[1].leftDirection = [x2 -100,y2];  gl.paths[0].pathPoints[0].rightDirection = [x2 +10,y2];  gl.strokeWeight = 2; gl.strokeColor = gl.parent.parent.swatches.item(id+"");  return gl;}