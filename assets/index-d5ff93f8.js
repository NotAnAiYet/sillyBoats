var Q=Object.defineProperty;var X=(e,t,n)=>t in e?Q(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var A=(e,t,n)=>(X(e,typeof t!="symbol"?t+"":t,n),n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const u of o.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&r(u)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();function a(){}function R(e){return e()}function z(){return Object.create(null)}function k(e){e.forEach(R)}function V(e){return typeof e=="function"}function N(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}let b;function D(e,t){return e===t?!0:(b||(b=document.createElement("a")),b.href=t,e===b.href)}function Y(e){return Object.keys(e).length===0}function w(e,t){e.appendChild(t)}function _(e,t,n){e.insertBefore(t,n||null)}function d(e){e.parentNode&&e.parentNode.removeChild(e)}function p(e){return document.createElement(e)}function G(e){return document.createTextNode(e)}function v(){return G(" ")}function Z(e,t,n,r){return e.addEventListener(t,n,r),()=>e.removeEventListener(t,n,r)}function g(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function ee(e){return Array.from(e.childNodes)}function te(e,t){t=""+t,e.data!==t&&(e.data=t)}let T;function x(e){T=e}const $=[],H=[];let y=[];const K=[],ne=Promise.resolve();let q=!1;function re(){q||(q=!0,ne.then(J))}function M(e){y.push(e)}const B=new Set;let h=0;function J(){if(h!==0)return;const e=T;do{try{for(;h<$.length;){const t=$[h];h++,x(t),se(t.$$)}}catch(t){throw $.length=0,h=0,t}for(x(null),$.length=0,h=0;H.length;)H.pop()();for(let t=0;t<y.length;t+=1){const n=y[t];B.has(n)||(B.add(n),n())}y.length=0}while($.length);for(;K.length;)K.pop()();q=!1,B.clear(),x(e)}function se(e){if(e.fragment!==null){e.update(),k(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(M)}}function ie(e){const t=[],n=[];y.forEach(r=>e.indexOf(r)===-1?t.push(r):n.push(r)),n.forEach(r=>r()),y=t}const E=new Set;let oe;function C(e,t){e&&e.i&&(E.delete(e),e.i(t))}function I(e,t,n,r){if(e&&e.o){if(E.has(e))return;E.add(e),oe.c.push(()=>{E.delete(e),r&&(n&&e.d(1),r())}),e.o(t)}else r&&r()}function P(e){e&&e.c()}function O(e,t,n){const{fragment:r,after_update:i}=e.$$;r&&r.m(t,n),M(()=>{const o=e.$$.on_mount.map(R).filter(V);e.$$.on_destroy?e.$$.on_destroy.push(...o):k(o),e.$$.on_mount=[]}),i.forEach(M)}function L(e,t){const n=e.$$;n.fragment!==null&&(ie(n.after_update),k(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function ue(e,t){e.$$.dirty[0]===-1&&($.push(e),re(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function j(e,t,n,r,i,o,u=null,c=[-1]){const l=T;x(e);const s=e.$$={fragment:null,ctx:[],props:o,update:a,not_equal:i,bound:z(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(l?l.$$.context:[])),callbacks:z(),dirty:c,skip_bound:!1,root:t.target||l.$$.root};u&&u(s.root);let f=!1;if(s.ctx=n?n(e,t.props||{},(m,F,...U)=>{const W=U.length?U[0]:F;return s.ctx&&i(s.ctx[m],s.ctx[m]=W)&&(!s.skip_bound&&s.bound[m]&&s.bound[m](W),f&&ue(e,m)),F}):[],s.update(),f=!0,k(s.before_update),s.fragment=r?r(s.ctx):!1,t.target){if(t.hydrate){const m=ee(t.target);s.fragment&&s.fragment.l(m),m.forEach(d)}else s.fragment&&s.fragment.c();t.intro&&C(e.$$.fragment),O(e,t.target,t.anchor),J()}x(l)}class S{constructor(){A(this,"$$");A(this,"$$set")}$destroy(){L(this,1),this.$destroy=a}$on(t,n){if(!V(n))return a;const r=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return r.push(n),()=>{const i=r.indexOf(n);i!==-1&&r.splice(i,1)}}$set(t){this.$$set&&!Y(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const ce="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(ce);const le="/assets/matrix-bd3f9bb9.gif";function fe(e){let t,n;return{c(){t=p("img"),g(t,"class","background svelte-1w1dx64"),D(t.src,n=le)||g(t,"src",n),g(t,"alt","matrix")},m(r,i){_(r,t,i)},p:a,i:a,o:a,d(r){r&&d(t)}}}class ae extends S{constructor(t){super(),j(this,t,null,fe,N,{})}}const de="/assets/under-construction-sign-6f80b2ae.gif";function _e(e){let t,n,r,i,o,u,c,l;return{c(){t=p("h1"),t.innerHTML='Welcome to <span class="sillyWorker svelte-1j52az8">Silly</span> Boats',n=v(),r=p("p"),r.textContent="This site is currently under construction",i=v(),o=p("img"),c=v(),l=p("p"),l.textContent="Feel free to click this button!",D(o.src,u=de)||g(o,"src",u),g(o,"alt","Under Construction"),g(o,"width","100%")},m(s,f){_(s,t,f),_(s,n,f),_(s,r,f),_(s,i,f),_(s,o,f),_(s,c,f),_(s,l,f)},p:a,i:a,o:a,d(s){s&&(d(t),d(n),d(r),d(i),d(o),d(c),d(l))}}}class me extends S{constructor(t){super(),j(this,t,null,_e,N,{})}}function pe(e){let t,n=e[0]>0?`you clicked me ${e[0]} times`:"I just count",r,i,o;return{c(){t=p("button"),r=G(n),g(t,"class","svelte-1qs4sfl")},m(u,c){_(u,t,c),w(t,r),i||(o=Z(t,"click",e[1]),i=!0)},p(u,[c]){c&1&&n!==(n=u[0]>0?`you clicked me ${u[0]} times`:"I just count")&&te(r,n)},i:a,o:a,d(u){u&&d(t),i=!1,o()}}}function ge(e,t,n){let r=0;return[r,()=>{n(0,r+=1)}]}class he extends S{constructor(t){super(),j(this,t,ge,pe,N,{})}}function $e(e){let t,n,r,i,o,u,c,l;return r=new ae({}),o=new me({}),c=new he({}),{c(){t=p("main"),n=p("div"),P(r.$$.fragment),i=v(),P(o.$$.fragment),u=v(),P(c.$$.fragment),g(n,"class","background")},m(s,f){_(s,t,f),w(t,n),O(r,n,null),w(n,i),O(o,n,null),w(n,u),O(c,n,null),l=!0},p:a,i(s){l||(C(r.$$.fragment,s),C(o.$$.fragment,s),C(c.$$.fragment,s),l=!0)},o(s){I(r.$$.fragment,s),I(o.$$.fragment,s),I(c.$$.fragment,s),l=!1},d(s){s&&d(t),L(r),L(o),L(c)}}}class ye extends S{constructor(t){super(),j(this,t,null,$e,N,{})}}new ye({target:document.getElementById("app")});
