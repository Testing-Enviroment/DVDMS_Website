(function(){
var data=(window.NEWS||[]).slice().sort(function(a,b){return a.date<b.date?1:a.date>b.date?-1:0});
var fmt=new Intl.DateTimeFormat('hr-HR',{day:'numeric',month:'long',year:'numeric'});
function date(s){var d=new Date(s+'T12:00:00');return isNaN(d)?s:fmt.format(d)}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function card(n,full){
 var a=el('article',full?'card':'');a.id='n-'+n.id;
 if(n.image){var im=new Image();im.src=n.image;im.alt='';im.loading='lazy';im.decoding='async';im.className='nimg';a.appendChild(im)}
 var t=el('time',null,date(n.date));t.dateTime=n.date;a.appendChild(t);
 if(n.sample)a.appendChild(el('span','tag','Primjer'));
 a.appendChild(el('h3',null,n.title));
 var paras=String(n.text||'').split(/\n\s*\n/);
 if(full){paras.forEach(function(p){a.appendChild(el('p',null,p))})}
 else{var s=paras[0];if(s.length>150)s=s.slice(0,150).replace(/\s+\S*$/,'')+'…';a.appendChild(el('p',null,s));
  var l=el('a','rm','Pročitaj više');l.href='novosti.html?vijest='+encodeURIComponent(n.id);a.appendChild(l)}
 return a}
var pv=document.getElementById('news-preview');
if(pv){data.slice(0,3).forEach(function(n){pv.appendChild(card(n,false))});if(!data.length)pv.appendChild(el('p',null,'Trenutno nema objava.'))}
var list=document.getElementById('news-list'),pager=document.getElementById('pager');
if(list){
 var PER=5,pages=Math.max(1,Math.ceil(data.length/PER));
 var q=new URLSearchParams(location.search),want=q.get('vijest');
 function fromUrl(){var n=parseInt(q.get('stranica'),10);if(want){var i=data.findIndex(function(d){return d.id===want});if(i>=0)return Math.floor(i/PER)+1}return n>=1&&n<=pages?n:1}
 function link(n,label,cls,cur){var a=el('a',cls||'',label);a.href='?stranica='+n;if(cur)a.setAttribute('aria-current','page');a.addEventListener('click',function(e){e.preventDefault();want=null;go(n,true)});return a}
 function go(n,push){
  list.innerHTML='';var s=(n-1)*PER;
  data.slice(s,s+PER).forEach(function(d){list.appendChild(card(d,true))});
  if(!data.length)list.appendChild(el('p',null,'Trenutno nema objava.'));
  pager.innerHTML='';
  if(pages>1){if(n>1)pager.appendChild(link(n-1,'‹ Prethodna','step'));var last=0;
   for(var p=1;p<=pages;p++){if(p===1||p===pages||Math.abs(p-n)<=1){if(last&&p-last>1)pager.appendChild(el('span',null,'…'));pager.appendChild(link(p,String(p),'',p===n));last=p}}
   if(n<pages)pager.appendChild(link(n+1,'Sljedeća ›','step'))}
  document.title='Novosti'+(n>1?' (stranica '+n+')':'')+' – DVD Moslavačka Slatina';
  if(push){history.pushState({},'','?stranica='+n);window.scrollTo({top:list.getBoundingClientRect().top+window.scrollY-100})}
  else if(want){var t=document.getElementById('n-'+want);if(t){t.classList.add('hl');setTimeout(function(){window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-100})},50)}}
 }
 window.addEventListener('popstate',function(){q=new URLSearchParams(location.search);want=null;go(fromUrl(),false)});
 go(fromUrl(),false);
}
})();
