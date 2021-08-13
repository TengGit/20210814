"use strict"
var res=[]
!function(t){function i(t,n){for(var e in n)"object"==typeof n[e]&&null!==n[e]?i(t[e],n[e]):t[e]=n[e]
return t}function n(t,n){var e=document.createElement(t)
return i(e,n)}function e(n,e){var s=t.resource.getResult(n)
return i(s,e)}function s(t,i){return void 0!==t?t:i}function r(t,i,n){return t.length>i&&void 0!==t[i]?t[i]:n}function a(t){return Math.round(1e3*t)/10+"%"}function o(t,i){return function(){t(i)}}function h(i,n){return s(i.trans,s(n.trans,t.nullTransistion))}function c(t,i){return s(t.transArg,s(i.transArg,[]))}function u(t,i,e,s){this._book=t,this._width=i,this._height=e,this._data=s||{},this._chapter=0,this._para=0,this._background=null,this._imlist=[],this._container=null,this._bgcontainer=n("div",{className:"widget full",id:"background-container"}),this._fgcontainer=n("div",{className:"widget full",id:"foreground-container"}),this._animate=[],this._disabled=!1,this._inclick=!1}function l(t,i){var n=[t]
i=i||{}
var e=c(i,this._data)
for(var s in e)n.push(e[s])
var r=h(i,this._data).apply(this,n)
return this._animate.push(r),r}function _(){for(var t=0;t<this._animate.length;t++)this._animate[t].finish()
this._animate=[]}function p(){this._animate&&_.apply(this)
var t=this._book[this._chapter][this._para]
t[0].call(this,t)}function f(t,i,n,r,o,h){var c=e(t,{className:"widget",style:{left:a(i/r),top:a(n/o)}})
return c.style.width=a(s(h.width,c.naturalWidth/r)),c.style.height=a(s(h.height,c.naturalHeight/o)),c}u.prototype.start=function(t){this._container=t,t.appendChild(this._bgcontainer),t.appendChild(this._fgcontainer),this._chapter=this._para=0,p.apply(this),t.addEventListener("click",o(function(t){t._disabled||t._inclick||(t._inclick=!0,t.next(),t._inclick=!1)},this))},u.prototype.next=function(){if(++this._para>=this._book[this._chapter].length)throw new RangeError("Non-ending chapter ended without a jump")
p.apply(this)},u.prototype.gotoChapter=function(t){this._chapter=t,this._para=0
for(var i=0;i<this._imlist.length;i++)this._fgcontainer.removeChild(this._imlist[i])
this._imlist=[],p.apply(this)},u.prototype.disableClickNext=function(){this._disabled=!0},u.prototype.enableClickNext=function(){this._disabled=!1},u.clbg=function(t){this.disableClickNext(),l.call(this,this._background,{trans:window.fadeOut,transArg:s(this._data.transArg,[1500])}).then(o(function(t){t._bgcontainer.removeChild(t._background),t._background=null,t.enableClickNext(),t._fgcontainer.click()},this))},u.clsd=function(t){for(var i=0;i<this._imlist.length;i++)this._fgcontainer.removeChild(this._imlist[i])
this._imlist=[],this._fgcontainer.click()},u.bg=function(t){this.disableClickNext()
var i=e(t[1],{className:"widget full"})
l.call(this,i,t.length>2?t[2]:{}).then(o(function(t){var i=t[0]
i._background&&i._bgcontainer.removeChild(i._background),i._background=t[1],i.enableClickNext(),t[1].click()},[this,i])),this._bgcontainer.appendChild(i)},u.img=function(t){var i=f(t[1],t[2],t[3],this._width,this._height,r(t,4,{}))
l.call(this,i,t.length>4?t[4]:{}).then(o(function(t){t.click()},i)),this._fgcontainer.appendChild(i),this._imlist.push(i)},u.ed=function(t){this.disableClickNext()
var i=e(t[1],{className:"widget full"})
l.call(this,i,t.length>2?t[2]:{}).then(o(function(t){var i=t[0]
i._background&&i._bgcontainer.removeChild(i._background),i._background=null},[this,i])),this._fgcontainer.appendChild(i),this._imlist.push(i)},u.jmp=function(t){this.gotoChapter(t[1])},u.pause=function(t){},u.choice=function(t){this.disableClickNext()
for(var i=1;i<t.length;i++){var n=t[i],e=f(n[0],n[1],n[2],this._width,this._height,r(n,4,{}))
e.classList.add("option"),l.call(this,e,n.length>4?n[4]:{}).then(o(function(t){t[1].addEventListener("click",o(function(t){t[0].enableClickNext(),t[0].gotoChapter(t[1])},[t[0],t[2][3]]))},[this,e,n])),this._fgcontainer.appendChild(e),this._imlist.push(e)}},t.Story=u}(window)
