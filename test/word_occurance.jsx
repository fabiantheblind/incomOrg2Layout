﻿var d = app.activeDocument;var p = d.pages[0];var tf = p.textFrames[0];var list = new Array();for(var i  = tf.words.length-1; i > 0;i--){           with (app.findChangeGrepOptions) { 		includeFootnotes = true;  		includeHiddenLayers = false; 		includeLockedLayersForFind = false; 		includeLockedStoriesForFind = false; 		includeMasterPages = true; 	}  	app.findGrepPreferences = null;  try{    var w = tf.words.item(i).contents;        $.writeln (i + " w: "+ w);	app.findGrepPreferences.findWhat = "\ "+w+ "\ ||"+"\ "+w+ "\.";     app.changeGrepPreferences.changeTo = ""; 	var res = d.findGrep();         list.push({"word":tf.words[i].contents,"num":res.length + 1});        d.changeGrep();    }catch(e){            $.writeln (e);        }    }alert(list);var str = "";for(var j in list){    str = str + list[j].word + " occr: " + list[j].num + " \n";        }tf.contents = str;