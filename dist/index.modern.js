function e(){return e=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},e.apply(this,arguments)}const t=new Map,n="rtl"===window.getComputedStyle(document.documentElement).direction,r={TOP_LEFT:[],TOP:["Ctrl+Home","Meta+ArrowUp"],TOP_RIGHT:[],UP:["ArrowUp"],DOWN:["ArrowDown"],HOME:["Home","Meta+ArrowLeft"],END:["End","Meta+ArrowRight"],LEFT:["ArrowLeft"],RIGHT:["ArrowRight"],BOTTOM_LEFT:[],BOTTOM:["Ctrl+End","Meta+ArrowDown"],BOTTOM_RIGHT:[]},o=(e,t)=>{if((t.includes("ArrowLeft")||1==t.length)&&!t.includes("Home")){const n=e.findIndex(e=>e.includes("ArrowRight")||1==e.length);return-1!==n?e[n]:t}if((t.includes("ArrowRight")||1==t.length)&&!t.includes("End")){const n=e.findIndex(e=>e.includes("ArrowLeft")||1==e.length);return-1!==n?e[n]:t}return t},s=(t={})=>{const s=e({},r,t);if(n){[s.LEFT,s.RIGHT]=[s.RIGHT,s.LEFT],[s.TOP_LEFT,s.TOP_RIGHT]=[s.TOP_RIGHT,s.TOP_LEFT],[s.BOTTOM_LEFT,s.BOTTOM_RIGHT]=[s.BOTTOM_RIGHT,s.BOTTOM_LEFT];const e=s.HOME,t=s.END;s.HOME=e.map(e=>o(t,e)),s.END=t.map(t=>o(e,t))}for(const e in s)s[e]=s[e].map(e=>e.split("+").map(e=>1===e.length?e.toUpperCase():e).join("+"));const a={};for(const e in s)s[e].forEach(t=>{a[t]=e});return a},a=e=>{const{currentTarget:n}=e,r=t.get(n),o=[...r.targets];for(const[s,a]of o.entries())if(a.contains(e.target)){e.preventDefault(),r.index=s,r.focused=!0,I(n,a),t.set("last_rover",n);break}},i=e=>{const{currentTarget:n,target:r}=e;if(t.has(n)){const e=t.get(n),o=[...e.targets].indexOf(r);-1!==o&&e.index!==o&&(e.index=o,e.focused=!0,I(n,r),t.set("last_rover",n))}},c=e=>{const{currentTarget:n}=e,r=t.get(n);r&&(r.focused=!1)},l=e=>{const{currentTarget:n}=e,r=(e=>{const t=[e.ctrlKey?"Ctrl":null,e.altKey?"Alt":null,e.shiftKey?"Shift":null,e.metaKey?"Meta":null].filter(Boolean),n=1===e.key.length?e.key.toUpperCase():e.key;return t.length>0?t.join("+")+`+${n}`:n})(e),{keyBinds:o}=t.get(n);switch(o[r]){case"RIGHT":e.preventDefault(),T(n);break;case"LEFT":e.preventDefault(),p(n);break;case"DOWN":e.preventDefault(),h(n);break;case"UP":e.preventDefault(),x(n);break;case"HOME":e.preventDefault(),v(n);break;case"END":e.preventDefault(),w(n);break;case"BOTTOM":e.preventDefault(),E(n);break;case"TOP":e.preventDefault(),O(n);break;case"TOP_LEFT":e.preventDefault(),M(n);break;case"TOP_RIGHT":e.preventDefault(),k(n);break;case"BOTTOM_LEFT":e.preventDefault(),L(n);break;case"BOTTOM_RIGHT":e.preventDefault(),y(n)}},d=(n,r)=>{const o=new MutationObserver(o=>{o.forEach(o=>{"childList"===o.type&&n.contains(o.target)&&((n,r)=>{const o=n.querySelectorAll(r),s=u(n,o),a=g(n,o),i=t.get(n),c=i.columns,l=i.index,d=Math.floor(l/c),f=l%c,m=Math.min(d,a-1)*s+Math.min(f,s-1),b=o[m];let T,p;if(b.disabled||b.inert){for(const e of o)if(!e.disabled&&!e.inert){T=e;break}p=[...o].indexOf(T)}else T=b,p=m;o.forEach(e=>e.tabIndex=-1),T.tabIndex=0,i.focused&&I(n,T),t.set(n,e({},i,{targets:o,columns:s,rows:a,active:T,index:p}))})(n,r)})});return o.observe(n,{childList:!0,subtree:!0}),o},f=(n,r)=>{const o=new ResizeObserver(()=>(n=>{const r=t.get(n),o=u(n,[...r.targets]),s=g(n,[...r.targets]);t.set(n,e({},r,{columns:o,rows:s}))})(n));return[n,...n.querySelectorAll(r)].forEach(e=>{o.observe(e)}),o},u=(e,t)=>{const n=window.getComputedStyle(e);if(n.getPropertyValue("grid-template-columns"))return n.getPropertyValue("grid-template-columns").split(" ").length;const r=e.offsetWidth,o=[...t];let s=0,a=0;for(let e=0,n=o.length;e<n;e++){const n=o[e];s+=Math.floor(n.offsetWidth);const i=t[e+1];if(i){const e=i.offsetLeft-(n.offsetLeft+n.offsetWidth);e>0&&(s+=Math.floor(e))}if(s>r)break;a++}return a},g=(e,t)=>{const n=window.getComputedStyle(e);return n.getPropertyValue("grid-template-rows")?n.getPropertyValue("grid-template-rows").split(" ").length:Math.ceil(t.length/u(e,t))},m=({element:e,target:n=":scope *",wrap:r=!0,VKMap:o={}})=>{const m=e.querySelectorAll(n);let b;for(const e of m)if(!e.disabled&&!e.inert){b=e;break}const T=[...m].indexOf(b),p=u(e,m),h=g(e,m),x=s(o);e.tabIndex=-1,m.forEach(e=>e.tabIndex=-1),b.tabIndex=0,t.set(e,{targets:m,wrap:r,active:b,index:T,rows:h,columns:p,focused:!1,keyBinds:x}),e.addEventListener("pointerdown",a),e.addEventListener("focusin",i),e.addEventListener("focusout",c),e.addEventListener("keydown",l),((e,n=[])=>{const r=e.parentNode,o=new MutationObserver(e=>{e.filter(e=>e.removedNodes.length>0).forEach(e=>{[...e.removedNodes].filter(e=>1===e.nodeType).forEach(e=>{t.forEach((r,s)=>{"last_rover"!==s&&e.contains(s)&&(s.removeEventListener("pointerdown",a),s.removeEventListener("focusin",i),s.removeEventListener("focusout",c),s.removeEventListener("keydown",l),t.delete(s),r.targets.forEach(e=>e.tabIndex=""),(0===t.size||1===t.size&&t.has("last_rover"))&&(t.clear(),o.disconnect(),n.forEach(e=>e.disconnect())))})})})});o.observe(r,{childList:!0,subtree:!0})})(e,{observers:[d(e,n),f(e,n)]})},b=(n,r)=>{const o=t.get(n);if(!o)throw new Error("Rover not found");const a=e({},o,r);r.VKMap&&(a.keyBinds=s(r.VKMap)),t.set(n,a)},T=e=>{const n=t.get(e),r=Math.floor(n.index/n.columns),o=n.wrap?n.targets.length-1:(r+1)*n.columns-1;let s=n.index;for(;s<o;){s++;const t=n.targets[s];if(t&&!t.inert&&!t.disabled){n.index=s,I(e,t);break}}},p=e=>{const n=t.get(e),r=Math.floor(n.index/n.columns),o=n.wrap?0:r*n.columns;let s=n.index;for(;s>o;){s--;const t=n.targets[s];if(t&&!t.inert&&!t.disabled){n.index=s,I(e,t);break}}},h=e=>{const n=t.get(e),r=n.rows*n.columns+n.index%n.columns;let o=n.index;for(;o<r;){o+=n.columns;const t=n.targets[o];if(t&&!t.inert&&!t.disabled){n.index=o,I(e,t);break}}},x=e=>{const n=t.get(e),r=n.index%n.columns;let o=n.index;for(;o>r;){o-=n.columns;const t=n.targets[o];if(t&&!t.inert&&!t.disabled){n.index=o,I(e,t);break}}},v=e=>{const n=t.get(e),r=Math.floor(n.index/n.columns);let o=0;for(;o<n.columns;){const e=n.targets[r*n.columns+o];if(e&&!e.inert&&!e.disabled)break;o++}n.index=r*n.columns+o;const s=n.targets[n.index];s&&I(e,s)},w=e=>{const n=t.get(e),r=Math.floor(n.index/n.columns);let o=n.columns-1;for(;o>=0;){const e=n.targets[r*n.columns+o];if(e&&!e.inert&&!e.disabled)break;o--}n.index=r*n.columns+o;const s=n.targets[n.index];s&&I(e,s)},O=e=>{const n=t.get(e),r=Math.floor(n.index/n.columns);let o=0;for(;o<r;){const e=n.targets[n.index+(o-r)*n.columns];if(e&&!e.inert&&!e.disabled)break;o++}n.index+=n.columns*(o-r);const s=n.targets[n.index];s&&I(e,s)},E=e=>{const n=t.get(e),r=Math.floor(n.index/n.columns);let o=n.rows-1;for(;o>r;){const e=n.targets[n.index+(o-r)*n.columns];if(e&&!e.inert&&!e.disabled)break;o--}n.index+=n.columns*(o-r);const s=n.targets[n.index];s&&I(e,s)},M=e=>{const n=t.get(e),r=n.targets[0];!r||r.inert||r.disabled||(n.index=0,I(e,r))},k=e=>{const n=t.get(e),r=n.targets[n.columns-1];!r||r.inert||r.disabled||(n.index=n.columns-1,I(e,r))},L=e=>{const n=t.get(e),r=n.targets[n.columns*(n.rows-1)];!r||r.inert||r.disabled||(n.index=n.columns*(n.rows-1),I(e,r))},y=e=>{const n=t.get(e),r=n.targets[n.columns*n.rows-1];!r||r.inert||r.disabled||(n.index=n.columns*n.rows-1,I(e,r))},I=(e,n)=>{const r=t.get(e);r.active.tabIndex=-1,r.active=n,r.active.tabIndex=0,r.active.focus(),r.focused=!0};export{m as rovingGrid,b as updateRover};
//# sourceMappingURL=index.modern.js.map
