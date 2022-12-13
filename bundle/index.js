var frag=function(exports){"use strict";const el={check:el=>el instanceof Element||el instanceof DocumentFragment||el instanceof Document,from(el,parent){if(this.check(el))return el;if(parent||(parent=document),"string"==typeof el)return parent.querySelector(el);throw new Error("not a string nor an element! for element "+el+" inside of parent "+parent)},async modify(el,callback,parent){let classList=(el=this.from(el,parent)).classList;return classList.contains("unmodified")||classList.add("unmodified"),classList.remove("unmodified"),await callback(el),classList.add("modified"),el},range(el,parent){if(el instanceof Range)return el;parent=this.from(parent),el=this.from(el,parent);let r=document.createRange();return r.selectNode(el),r}};class Collection{type=void 0;frags=void 0;constructor(frag){this.type=frag}target(parent,target){parent=el.from(parent),this.frags=[];let node=parent.querySelector(target);for(;null!==node;){let f=(new this.type).target(parent,node);this.frags.push(f),node=parent.querySelector(target)}return this}async build(){for(let f in this.frags)await this.frags[f].build();return this}mount(){return this.frags.forEach((f=>f.mount())),this}unmount(){return this.frags.forEach((f=>f.unmount())),this}}const hook={constructor(){},build(){},mount(){},mounted(){},unmount(){},unmounted(){}};class Frag{path="/pages/404.html";hook=hook;frags=[];frag=void 0;parent=void 0;old=void 0;range=void 0;children=void 0;constructor(){this.hook={...hook,...this.hook}}target(parent,target){return this.parent=el.from(parent),this.range=el.range(target,this.parent),this.old=this.range.extractContents(),this}async build(){this.frag=document.createRange().createContextualFragment(await fetch(this.path).then((data=>data.text()))),this.frags&&(this.children=[]);for(let tag in this.frags){let c=await new Collection(this.frags[tag]).target(this.frag,tag).build();this.children.push(c)}return this.hook.build&&this.hook.build(this),this}mount(){return this.hook.mount&&this.hook.mount(this),this.children.forEach((c=>c.mount())),this.range.insertNode(this.frag),this.parent.classList&&this.parent.classList.add("mounted"),this.hook.mounted&&this.hook.mounted(this),this.frag=void 0,this}unmount(){if(!this.range)throw new Error("this frag has no range to unmount!");return!!this.parent&&(this.hook.unmount&&this.hook.unmount(this),this.children.forEach((c=>c.unmount())),this.frag=this.range.extractContents(),this.range.insertNode(this.old),this.parent.classList&&this.parent.classList.remove("mounted"),this.hook.unmounted&&this.hook.unmounted(this),this.old=void 0,this)}}exports.router=void 0;return exports.Collection=Collection,exports.Frag=Frag,exports.Page=class extends Frag{static href="/404";static name=void 0;static hidden=!1},exports.Router=class{container;view;routes={};page={unmount:()=>{}};constructor(routes){if(exports.router)throw new Error("a router already exists for this document!");this.update=this.update.bind(this),window.route=this.route,window.router=exports.router=this,window.onpopstate=this.update,routes.forEach((r=>this.routes[r.href]=r))}target(container,view){return this.container=el.from(container||"main"),this.view=el.range(view||"view",this.container),this.view.deleteContents(),this.container.id="router",this}async update(url){return""===(url=url||window.location.pathname)&&(url="/"),this.page.unmount(),this.container.innerHTML="",(new(this.routes[url]||this.routes["/404"])).target(this.container,this.view).build().then((f=>f.mount())).then((f=>this.page=f)),this}route(event){return(event=event||window.EventSource).preventDefault(),window.location.pathname!==(event.target.pathname||"/")&&(window.history.pushState({},"",event.target.href||"/"),this.update()),this}},exports.el=el,exports}({});