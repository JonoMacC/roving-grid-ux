!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e||self).rovingGridUx={})}(this,function(e){function t(){return t=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},t.apply(this,arguments)}function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function n(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(n)return(n=n.call(e)).next.bind(n);if(Array.isArray(e)||(n=function(e,t){if(e){if("string"==typeof e)return r(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var o=0;return function(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o=new Map,a="rtl"===window.getComputedStyle(document.documentElement).direction,i={TOP_LEFT:[],TOP:["Ctrl+Home","Meta+ArrowUp"],TOP_RIGHT:[],UP:["ArrowUp"],DOWN:["ArrowDown"],HOME:["Home","Meta+ArrowLeft"],END:["End","Meta+ArrowRight"],LEFT:["ArrowLeft"],RIGHT:["ArrowRight"],BOTTOM_LEFT:[],BOTTOM:["Ctrl+End","Meta+ArrowDown"],BOTTOM_RIGHT:[]},u=function(e,t){if((t.includes("ArrowLeft")||1==t.length)&&!t.includes("Home")){var r=e.findIndex(function(e){return e.includes("ArrowRight")||1==e.length});return-1!==r?e[r]:t}if((t.includes("ArrowRight")||1==t.length)&&!t.includes("End")){var n=e.findIndex(function(e){return e.includes("ArrowLeft")||1==e.length});return-1!==n?e[n]:t}return t},s=function(e){void 0===e&&(e={});var r=t({},i,e);if(a){var n=[r.RIGHT,r.LEFT];r.LEFT=n[0],r.RIGHT=n[1];var o=[r.TOP_RIGHT,r.TOP_LEFT];r.TOP_LEFT=o[0],r.TOP_RIGHT=o[1];var s=[r.BOTTOM_RIGHT,r.BOTTOM_LEFT];r.BOTTOM_LEFT=s[0],r.BOTTOM_RIGHT=s[1];var c=r.HOME,f=r.END;r.HOME=c.map(function(e){return u(f,e)}),r.END=f.map(function(e){return u(c,e)})}for(var l in r)r[l]=r[l].map(function(e){return e.split("+").map(function(e){return 1===e.length?e.toUpperCase():e}).join("+")});var d={},v=function(e){r[e].forEach(function(t){d[t]=e})};for(var g in r)v(g);return d},c=function(e){for(var t,r=e.currentTarget,a=o.get(r),i=n([].concat(a.targets).entries());!(t=i()).done;){var u=t.value,s=u[0],c=u[1];if(c.contains(e.target)){e.preventDefault(),a.index=s,a.focused=!0,L(r,c),o.set("last_rover",r);break}}},f=function(e){var t=e.currentTarget,r=e.target;if(o.has(t)){var n=o.get(t),a=[].concat(n.targets).indexOf(r);-1!==a&&n.index!==a&&(n.index=a,n.focused=!0,L(t,r),o.set("last_rover",t))}},l=function(e){var t=o.get(e.currentTarget);t&&(t.focused=!1)},d=function(e){var t=e.currentTarget,r=function(e){var t=[e.ctrlKey?"Ctrl":null,e.altKey?"Alt":null,e.shiftKey?"Shift":null,e.metaKey?"Meta":null].filter(Boolean),r=1===e.key.length?e.key.toUpperCase():e.key;return t.length>0?t.join("+")+"+"+r:r}(e);switch(o.get(t).keyBinds[r]){case"RIGHT":e.preventDefault(),m(t);break;case"LEFT":e.preventDefault(),p(t);break;case"DOWN":e.preventDefault(),b(t);break;case"UP":e.preventDefault(),h(t);break;case"HOME":e.preventDefault(),T(t);break;case"END":e.preventDefault(),x(t);break;case"BOTTOM":e.preventDefault(),O(t);break;case"TOP":e.preventDefault(),w(t);break;case"TOP_LEFT":e.preventDefault(),y(t);break;case"TOP_RIGHT":e.preventDefault(),E(t);break;case"BOTTOM_LEFT":e.preventDefault(),M(t);break;case"BOTTOM_RIGHT":e.preventDefault(),k(t)}},v=function(e,r){var n=e.querySelectorAll(r),a=g(e,n),i=Math.ceil(n.length/a),u=o.get(e),s=u.columns,c=u.index,f=Math.floor(c/s),l=c%s,d=Math.min(f,i-1)*a+Math.min(l,a-1),v=n[d];n.forEach(function(e){return e.tabIndex=-1}),v.tabIndex=0,u.focused&&L(e,v),o.set(e,t({},u,{targets:n,columns:a,rows:i,active:v,index:d}))},g=function(e,t){var r=window.getComputedStyle(e);if(r.getPropertyValue("grid-template-columns"))return r.getPropertyValue("grid-template-columns").split(" ").length;for(var n=e.offsetWidth,o=[].concat(t),a=0,i=0,u=0,s=o.length;u<s;u++){var c=o[u];a+=Math.floor(c.offsetWidth);var f=t[u+1];if(f){var l=f.offsetLeft-(c.offsetLeft+c.offsetWidth);l>0&&(a+=Math.floor(l))}if(a>n)break;i++}return i},m=function(e){for(var t=o.get(e),r=Math.floor(t.index/t.columns),n=t.wrap?t.targets.length-1:(r+1)*t.columns-1,a=t.index;a<n;){a++;var i=t.targets[a];if(i&&!i.inert&&!i.disabled){t.index=a,L(e,i);break}}},p=function(e){for(var t=o.get(e),r=Math.floor(t.index/t.columns),n=t.wrap?0:r*t.columns,a=t.index;a>n;){a--;var i=t.targets[a];if(i&&!i.inert&&!i.disabled){t.index=a,L(e,i);break}}},b=function(e){for(var t=o.get(e),r=t.rows*t.columns+t.index%t.columns,n=t.index;n<r;){var a=t.targets[n+=t.columns];if(a&&!a.inert&&!a.disabled){t.index=n,L(e,a);break}}},h=function(e){for(var t=o.get(e),r=t.index%t.columns,n=t.index;n>r;){var a=t.targets[n-=t.columns];if(a&&!a.inert&&!a.disabled){t.index=n,L(e,a);break}}},T=function(e){for(var t=o.get(e),r=Math.floor(t.index/t.columns),n=0;n<t.columns;){var a=t.targets[r*t.columns+n];if(a&&!a.inert&&!a.disabled)break;n++}t.index=r*t.columns+n;var i=t.targets[t.index];i&&L(e,i)},x=function(e){for(var t=o.get(e),r=Math.floor(t.index/t.columns),n=t.columns-1;n>=0;){var a=t.targets[r*t.columns+n];if(a&&!a.inert&&!a.disabled)break;n--}t.index=r*t.columns+n;var i=t.targets[t.index];i&&L(e,i)},w=function(e){for(var t=o.get(e),r=Math.floor(t.index/t.columns),n=0;n<r;){var a=t.targets[t.index+(n-r)*t.columns];if(a&&!a.inert&&!a.disabled)break;n++}t.index+=t.columns*(n-r);var i=t.targets[t.index];i&&L(e,i)},O=function(e){for(var t=o.get(e),r=Math.floor(t.index/t.columns),n=t.rows-1;n>r;){var a=t.targets[t.index+(n-r)*t.columns];if(a&&!a.inert&&!a.disabled)break;n--}t.index+=t.columns*(n-r);var i=t.targets[t.index];i&&L(e,i)},y=function(e){var t=o.get(e),r=t.targets[0];!r||r.inert||r.disabled||(t.index=0,L(e,r))},E=function(e){var t=o.get(e),r=t.targets[t.columns-1];!r||r.inert||r.disabled||(t.index=t.columns-1,L(e,r))},M=function(e){var t=o.get(e),r=t.targets[t.columns*(t.rows-1)];!r||r.inert||r.disabled||(t.index=t.columns*(t.rows-1),L(e,r))},k=function(e){var t=o.get(e),r=t.targets[t.columns*t.rows-1];!r||r.inert||r.disabled||(t.index=t.columns*t.rows-1,L(e,r))},L=function(e,t){var r=o.get(e);r.active.tabIndex=-1,r.active=t,r.active.tabIndex=0,r.active.focus(),r.focused=!0};e.rovingGrid=function(e){var t=e.element,r=e.target,a=void 0===r?":scope *":r,i=e.wrap,u=void 0===i||i,m=e.VKMap,p=void 0===m?{}:m,b=t.querySelectorAll(a),h=b[0],T=g(t,b),x=function(e,t){var r=window.getComputedStyle(e);return r.getPropertyValue("grid-template-rows")?r.getPropertyValue("grid-template-rows").split(" ").length:Math.ceil(t.length/g(e,t))}(t,b),w=s(p);t.tabIndex=-1,b.forEach(function(e){return e.tabIndex=-1}),h.tabIndex=0,o.set(t,{targets:b,wrap:u,active:h,index:0,rows:x,columns:T,focused:!1,keyBinds:w}),t.addEventListener("pointerdown",c),t.addEventListener("focusin",f),t.addEventListener("focusout",l),t.addEventListener("keydown",d);var O=function(e,t){var r=new MutationObserver(function(r,n){r.forEach(function(r){"childList"===r.type&&e.contains(r.target)&&v(e,t)})});return r.observe(e,{childList:!0,subtree:!0}),r}(t,a),y=function(e,t){var r=new ResizeObserver(function(r){for(var o=n(r);!o().done;)v(e,t)});return r.observe(e),e.querySelectorAll(t).forEach(function(e){r.observe(e)}),r}(t,a);!function(e,t){var r=(void 0===t?{}:t).observers,n=void 0===r?[]:r,a=e.parentNode,i=new MutationObserver(function(e,t){e.filter(function(e){return e.removedNodes.length>0}).forEach(function(e){[].concat(e.removedNodes).filter(function(e){return 1===e.nodeType}).forEach(function(e){o.forEach(function(t,r){"last_rover"!==r&&e.contains(r)&&(r.removeEventListener("pointerdown",c),r.removeEventListener("focusin",f),r.removeEventListener("focusout",l),r.removeEventListener("keydown",d),o.delete(r),t.targets.forEach(function(e){return e.tabIndex=""}),(0===o.size||1===o.size&&o.has("last_rover"))&&(o.clear(),i.disconnect(),n.forEach(function(e){return e.disconnect()})))})})})});i.observe(a,{childList:!0,subtree:!0})}(t,{observers:[O,y]})},e.updateRover=function(e,r){var n=o.get(e);if(!n)throw new Error("Rover not found");var a=t({},n,r);r.VKMap&&(a.keyBinds=s(r.VKMap)),o.set(e,a)}});
//# sourceMappingURL=index.umd.js.map