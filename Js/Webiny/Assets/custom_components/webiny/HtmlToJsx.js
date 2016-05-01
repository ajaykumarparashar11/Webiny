!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.HTMLtoJSX=e():t.HTMLtoJSX=e()}(this,function(){return function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={exports:{},id:i,loaded:!1};return t[i].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){/** @preserve
 *  Copyright (c) 2014, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 *
 */
"use strict";function i(t,e){if(1===e)return t;if(0>e)throw new Error;for(var n="";e;)1&e&&(n+=t),(e>>=1)&&(t+=t);return n}function r(t,e){return t.slice(-e.length)===e}function o(t,e){return r(t,e)?t.slice(0,-e.length):t}function s(t){return t.replace(/-(.)/g,function(t,e){return e.toUpperCase()})}function a(t){return!/[^\s]/.test(t)}function u(t){return/^\d+px$/.test(t)}function l(t){return void 0!==t&&null!==t&&("number"==typeof t||parseInt(t,10)==t)}function c(t){return _.textContent=t,_.innerHTML}var p={ELEMENT:1,TEXT:3,COMMENT:8},h={"for":"htmlFor","class":"className"},d={input:{checked:"defaultChecked",value:"defaultValue"}},f=n(1);for(var m in f.Properties)if(f.Properties.hasOwnProperty(m)){var E=f.DOMAttributeNames[m]||m.toLowerCase();h[E]||(h[E]=m)}var g;g=function(t){return document.createElement(t)};var _=g("div"),v=function(t){this.config=t||{},void 0===this.config.createClass&&(this.config.createClass=!0),this.config.indent||(this.config.indent="  ")};v.prototype={reset:function(){this.output="",this.level=0,this._inPreTag=!1},convert:function(t){this.reset();var e=g("div");return e.innerHTML="\n"+this._cleanInput(t)+"\n",this.config.createClass&&(this.config.outputClassName?this.output="var "+this.config.outputClassName+" = React.createClass({\n":this.output="React.createClass({\n",this.output+=this.config.indent+"render: function() {\n",this.output+=this.config.indent+this.config.indent+"return (\n"),this._onlyOneTopLevel(e)?this._traverse(e):(this.output+=this.config.indent+this.config.indent+this.config.indent,this.level++,this._visit(e)),this.output=this.output.trim()+"\n",this.config.createClass&&(this.output+=this.config.indent+this.config.indent+");\n",this.output+=this.config.indent+"}\n",this.output+="});"),this.output},_cleanInput:function(t){return t=t.trim(),t=t.replace(/<script([\s\S]*?)<\/script>/g,"")},_onlyOneTopLevel:function(t){if(1===t.childNodes.length&&t.childNodes[0].nodeType===p.ELEMENT)return!0;for(var e=!1,n=0,i=t.childNodes.length;i>n;n++){var r=t.childNodes[n];if(r.nodeType===p.ELEMENT){if(e)return!1;e=!0}else if(r.nodeType===p.TEXT&&!a(r.textContent))return!1}return!0},_getIndentedNewline:function(){return"\n"+i(this.config.indent,this.level+2)},_visit:function(t){this._beginVisit(t),this._traverse(t),this._endVisit(t)},_traverse:function(t){this.level++;for(var e=0,n=t.childNodes.length;n>e;e++)this._visit(t.childNodes[e]);this.level--},_beginVisit:function(t){switch(t.nodeType){case p.ELEMENT:this._beginVisitElement(t);break;case p.TEXT:this._visitText(t);break;case p.COMMENT:this._visitComment(t);break;default:console.warn("Unrecognised node type: "+t.nodeType)}},_endVisit:function(t){switch(t.nodeType){case p.ELEMENT:this._endVisitElement(t);break;case p.TEXT:case p.COMMENT:}},_beginVisitElement:function(t){for(var e=t.tagName.toLowerCase(),n=[],i=0,r=t.attributes.length;r>i;i++)n.push(this._getElementAttribute(t,t.attributes[i]));"textarea"===e&&n.push("defaultValue={"+JSON.stringify(t.value)+"}"),"style"===e&&n.push("dangerouslySetInnerHTML={{__html: "+JSON.stringify(t.textContent)+" }}"),"pre"===e&&(this._inPreTag=!0),this.output+="<"+e,n.length>0&&(this.output+=" "+n.join(" ")),this._isSelfClosing(t)||(this.output+=">")},_endVisitElement:function(t){var e=t.tagName.toLowerCase();this.output=o(this.output,this.config.indent),this._isSelfClosing(t)?this.output+=" />":this.output+="</"+t.tagName.toLowerCase()+">","pre"===e&&(this._inPreTag=!1)},_isSelfClosing:function(t){return!t.firstChild||"textarea"===t.tagName.toLowerCase()||"style"===t.tagName.toLowerCase()},_visitText:function(t){var e=t.parentNode&&t.parentNode.tagName.toLowerCase();if("textarea"!==e&&"style"!==e){var n=c(t.textContent);this._inPreTag?n=n.replace(/\r/g,"").replace(/( {2,}|\n|\t|\{|\})/g,function(t){return"{"+JSON.stringify(t)+"}"}):(n=n.replace(/(\{|\})/g,function(t){return"{'"+t+"'}"}),n.indexOf("\n")>-1&&(n=n.replace(/\n\s*/g,this._getIndentedNewline()))),this.output+=n}},_visitComment:function(t){this.output+="{/*"+t.textContent.replace("*/","* /")+"*/}"},_getElementAttribute:function(t,e){switch(e.name){case"style":return this._getStyleAttribute(e.value);default:var n=t.tagName.toLowerCase(),i=d[n]&&d[n][e.name]||h[e.name]||e.name,r=i;return l(e.value)?r+="={"+e.value+"}":e.value.length>0&&(r+='="'+e.value.replace(/"/gm,"&quot;")+'"'),r}},_getStyleAttribute:function(t){var e=new y(t).toJSXString();return"style={{"+e+"}}"}};var y=function(t){this.parse(t)};y.prototype={parse:function(t){this.styles={},t.split(";").forEach(function(t){t=t.trim();var e=t.indexOf(":"),n=t.substr(0,e),i=t.substr(e+1).trim();""!==n&&(n=n.toLowerCase(),this.styles[n]=i)},this)},toJSXString:function(){var t=[];for(var e in this.styles)this.styles.hasOwnProperty(e)&&t.push(this.toJSXKey(e)+": "+this.toJSXValue(this.styles[e]));return t.join(", ")},toJSXKey:function(t){return/^-ms-/.test(t)&&(t=t.substr(1)),s(t)},toJSXValue:function(t){return l(t)?t:u(t)?o(t,"px"):"'"+t.replace(/'/g,'"')+"'"}},t.exports=v},function(t,e,n){"use strict";var i,r=n(2),o=n(4),s=r.injection.MUST_USE_ATTRIBUTE,a=r.injection.MUST_USE_PROPERTY,u=r.injection.HAS_BOOLEAN_VALUE,l=r.injection.HAS_SIDE_EFFECTS,c=r.injection.HAS_NUMERIC_VALUE,p=r.injection.HAS_POSITIVE_NUMERIC_VALUE,h=r.injection.HAS_OVERLOADED_BOOLEAN_VALUE;if(o.canUseDOM){var d=document.implementation;i=d&&d.hasFeature&&d.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")}var f={isCustomAttribute:RegExp.prototype.test.bind(/^(data|aria)-[a-z_][a-z\d_.\-]*$/),Properties:{accept:null,acceptCharset:null,accessKey:null,action:null,allowFullScreen:s|u,allowTransparency:s,alt:null,async:u,autoComplete:null,autoPlay:u,capture:s|u,cellPadding:null,cellSpacing:null,charSet:s,challenge:s,checked:a|u,classID:s,className:i?s:a,cols:s|p,colSpan:null,content:null,contentEditable:null,contextMenu:s,controls:a|u,coords:null,crossOrigin:null,data:null,dateTime:s,"default":u,defer:u,dir:null,disabled:s|u,download:h,draggable:null,encType:null,form:s,formAction:s,formEncType:s,formMethod:s,formNoValidate:u,formTarget:s,frameBorder:s,headers:null,height:s,hidden:s|u,high:null,href:null,hrefLang:null,htmlFor:null,httpEquiv:null,icon:null,id:a,inputMode:s,integrity:null,is:s,keyParams:s,keyType:s,kind:null,label:null,lang:null,list:s,loop:a|u,low:null,manifest:s,marginHeight:null,marginWidth:null,max:null,maxLength:s,media:s,mediaGroup:null,method:null,min:null,minLength:s,multiple:a|u,muted:a|u,name:null,nonce:s,noValidate:u,open:u,optimum:null,pattern:null,placeholder:null,poster:null,preload:null,radioGroup:null,readOnly:a|u,rel:null,required:u,reversed:u,role:s,rows:s|p,rowSpan:null,sandbox:null,scope:null,scoped:u,scrolling:null,seamless:s|u,selected:a|u,shape:null,size:s|p,sizes:s,span:p,spellCheck:null,src:null,srcDoc:a,srcLang:null,srcSet:s,start:c,step:null,style:null,summary:null,tabIndex:null,target:null,title:null,type:null,useMap:null,value:a|l,width:s,wmode:s,wrap:null,about:s,datatype:s,inlist:s,prefix:s,property:s,resource:s,"typeof":s,vocab:s,autoCapitalize:s,autoCorrect:s,autoSave:null,color:null,itemProp:s,itemScope:s|u,itemType:s,itemID:s,itemRef:s,results:null,security:s,unselectable:s},DOMAttributeNames:{acceptCharset:"accept-charset",className:"class",htmlFor:"for",httpEquiv:"http-equiv"},DOMPropertyNames:{autoComplete:"autocomplete",autoFocus:"autofocus",autoPlay:"autoplay",autoSave:"autosave",encType:"encoding",hrefLang:"hreflang",radioGroup:"radiogroup",spellCheck:"spellcheck",srcDoc:"srcdoc",srcSet:"srcset"}};t.exports=f},function(t,e,n){"use strict";function i(t,e){return(t&e)===e}var r=n(3),o={MUST_USE_ATTRIBUTE:1,MUST_USE_PROPERTY:2,HAS_SIDE_EFFECTS:4,HAS_BOOLEAN_VALUE:8,HAS_NUMERIC_VALUE:16,HAS_POSITIVE_NUMERIC_VALUE:48,HAS_OVERLOADED_BOOLEAN_VALUE:64,injectDOMPropertyConfig:function(t){var e=o,n=t.Properties||{},s=t.DOMAttributeNamespaces||{},u=t.DOMAttributeNames||{},l=t.DOMPropertyNames||{},c=t.DOMMutationMethods||{};t.isCustomAttribute&&a._isCustomAttributeFunctions.push(t.isCustomAttribute);for(var p in n){a.properties.hasOwnProperty(p)?r(!1):void 0;var h=p.toLowerCase(),d=n[p],f={attributeName:h,attributeNamespace:null,propertyName:p,mutationMethod:null,mustUseAttribute:i(d,e.MUST_USE_ATTRIBUTE),mustUseProperty:i(d,e.MUST_USE_PROPERTY),hasSideEffects:i(d,e.HAS_SIDE_EFFECTS),hasBooleanValue:i(d,e.HAS_BOOLEAN_VALUE),hasNumericValue:i(d,e.HAS_NUMERIC_VALUE),hasPositiveNumericValue:i(d,e.HAS_POSITIVE_NUMERIC_VALUE),hasOverloadedBooleanValue:i(d,e.HAS_OVERLOADED_BOOLEAN_VALUE)};if(f.mustUseAttribute&&f.mustUseProperty?r(!1):void 0,!f.mustUseProperty&&f.hasSideEffects?r(!1):void 0,f.hasBooleanValue+f.hasNumericValue+f.hasOverloadedBooleanValue<=1?void 0:r(!1),u.hasOwnProperty(p)){var m=u[p];f.attributeName=m}s.hasOwnProperty(p)&&(f.attributeNamespace=s[p]),l.hasOwnProperty(p)&&(f.propertyName=l[p]),c.hasOwnProperty(p)&&(f.mutationMethod=c[p]),a.properties[p]=f}}},s={},a={ID_ATTRIBUTE_NAME:"data-reactid",properties:{},getPossibleStandardName:null,_isCustomAttributeFunctions:[],isCustomAttribute:function(t){for(var e=0;e<a._isCustomAttributeFunctions.length;e++){var n=a._isCustomAttributeFunctions[e];if(n(t))return!0}return!1},getDefaultValueForProperty:function(t,e){var n,i=s[t];return i||(s[t]=i={}),e in i||(n=document.createElement(t),i[e]=n[e]),i[e]},injection:o};t.exports=a},function(t,e,n){"use strict";function i(t,e,n,i,r,o,s,a){if(!t){var u;if(void 0===e)u=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var l=[n,i,r,o,s,a],c=0;u=new Error(e.replace(/%s/g,function(){return l[c++]})),u.name="Invariant Violation"}throw u.framesToPop=1,u}}t.exports=i},function(t,e){"use strict";var n=!("undefined"==typeof window||!window.document||!window.document.createElement),i={canUseDOM:n,canUseWorkers:"undefined"!=typeof Worker,canUseEventListeners:n&&!(!window.addEventListener&&!window.attachEvent),canUseViewport:n&&!!window.screen,isInWorker:!n};t.exports=i}])});