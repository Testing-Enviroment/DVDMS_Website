(function(){
var PER=6,data=window.GALLERY||[],grid=document.getElementById('grid'),pager=document.getElementById('pager');
var pages=Math.max(1,Math.ceil(data.length/PER));
var L=data.map(function(d){return{full:d.full,alt:d.alt,caption:d.caption}});
function fromUrl(){var n=parseInt(new URLSearchParams(location.search).get('stranica'),10);return n>=1&&n<=pages?n:1}
function link(n,label,cls,cur){var a=document.createElement('a');a.href='?stranica='+n;a.textContent=label;if(cls)a.className=cls;if(cur)a.setAttribute('aria-current','page');
 a.addEventListener('click',function(e){e.preventDefault();go(n,true)});return a}
function go(n,push){
 var s=(n-1)*PER;grid.innerHTML='';
 data.slice(s,s+PER).forEach(function(d,k){
  var f=document.createElement('figure'),b=document.createElement('button'),im=new Image();
  im.src=d.thumb;im.width=d.w;im.height=d.h;im.alt=d.alt;im.loading='lazy';im.decoding='async';
  b.type='button';b.setAttribute('aria-label','Povećaj sliku: '+d.caption);b.appendChild(im);
  b.addEventListener('click',function(){openLightbox(L,s+k)});
  var c=document.createElement('figcaption');c.textContent=d.caption;f.appendChild(b);f.appendChild(c);grid.appendChild(f)});
 pager.innerHTML='';
 if(pages>1){
  if(n>1)pager.appendChild(link(n-1,'‹ Prethodna','step'));
  var last=0;for(var p=1;p<=pages;p++){if(p===1||p===pages||Math.abs(p-n)<=1){if(last&&p-last>1){var e=document.createElement('span');e.textContent='…';pager.appendChild(e)}pager.appendChild(link(p,p,'',p===n));last=p}}
  if(n<pages)pager.appendChild(link(n+1,'Sljedeća ›','step'));
 }
 document.title='Galerija'+(n>1?' (stranica '+n+')':'')+' – DVD Moslavačka Slatina';
 if(push){history.pushState({n:n},'','?stranica='+n);window.scrollTo({top:grid.getBoundingClientRect().top+window.scrollY-100})}
}
window.addEventListener('popstate',function(){go(fromUrl(),false)});
go(fromUrl(),false);
})();
