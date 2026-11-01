(function(){
'use strict';
var $=function(s){return document.querySelector(s)};
var cfg={},st={news:[],gal:[],shaN:null,shaG:null,edit:null};
var NEWS='assets/js/news-data.js',GAL='assets/js/gallery-data.js';
function msg(t,c){var m=$('#msg');m.textContent=t;m.className=t?c:''}
function busy(on,t){document.querySelectorAll('button').forEach(function(b){b.disabled=on});if(on)msg(t||'Spremam…','busy')}
function api(path,opt){opt=opt||{};opt.cache='no-store';opt.headers={'Authorization':'Bearer '+cfg.token,'Accept':'application/vnd.github+json'};
 return fetch('https://api.github.com/repos/'+cfg.owner+'/'+cfg.repo+path,opt).then(function(r){return r.text().then(function(t){if(!r.ok)throw new Error(r.status===401?'Token nije ispravan ili je istekao.':r.status===404?'Repozitorij ili datoteka nisu pronađeni (provjerite naziv, granu i dozvole tokena).':r.status+' '+t.slice(0,150));return JSON.parse(t)})})}
function getF(p){return api('/contents/'+p+'?ref='+encodeURIComponent(cfg.branch))}
function putF(p,b64,m,sha){var b={message:m,content:b64,branch:cfg.branch};if(sha)b.sha=sha;return api('/contents/'+p,{method:'PUT',body:JSON.stringify(b)})}
function delF(p,m){return getF(p).then(function(f){return api('/contents/'+p,{method:'DELETE',body:JSON.stringify({message:m,sha:f.sha,branch:cfg.branch})})}).catch(function(){})}
function dec(b){return decodeURIComponent(escape(atob(b.replace(/\n/g,''))))}
function enc(s){return btoa(unescape(encodeURIComponent(s)))}
function parse(t){return JSON.parse(t.slice(t.indexOf('['),t.lastIndexOf(']')+1))}
function slug(s){return String(s).toLowerCase().replace(/đ/g,'d').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40)||'slika'}
function resize(file,max,q){return createImageBitmap(file,{imageOrientation:'from-image'}).then(function(bm){var s=Math.min(1,max/Math.max(bm.width,bm.height)),c=document.createElement('canvas');c.width=Math.round(bm.width*s);c.height=Math.round(bm.height*s);c.getContext('2d').drawImage(bm,0,0,c.width,c.height);return{b64:c.toDataURL('image/jpeg',q).split(',')[1],w:c.width,h:c.height}})}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function btn(t,c,f){var b=el('button',c,t);b.type='button';b.addEventListener('click',f);return b}
function today(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function saveData(path,name,arr,key,m){return putF(path,enc('window.'+name+' = '+JSON.stringify(arr,null,1)+';\n'),m,st[key]).then(function(r){st[key]=r.content.sha})}
function sortNews(){st.news.sort(function(a,b){return a.date<b.date?1:a.date>b.date?-1:(a.id<b.id?1:-1)})}

function load(){busy(true,'Učitavam…');
 return Promise.all([getF(NEWS),getF(GAL)]).then(function(r){st.news=parse(dec(r[0].content));st.shaN=r[0].sha;st.gal=parse(dec(r[1].content));st.shaG=r[1].sha;
  $('#login').classList.add('hide');$('#app').classList.remove('hide');$('#logout').classList.remove('hide');renderNews();renderGal();msg('')}).finally(function(){busy(false)})}

/* ---- vijesti ---- */
function renderNews(){var L=$('#nList');L.innerHTML='';
 if(!st.news.length)L.appendChild(el('p',null,'Još nema vijesti.'));
 st.news.forEach(function(n){var r=el('div','item'),t=el('div','t');
  if(n.image){var i=new Image();i.src='../'+n.image;i.alt='';t.appendChild(i)}
  var d=el('div');d.appendChild(el('strong',null,n.title));d.appendChild(el('small',null,n.date+(n.sample?' · primjer':'')));t.appendChild(d);r.appendChild(t);
  var a=el('div');a.appendChild(btn('Uredi','sec',function(){editNews(n)}));a.appendChild(document.createTextNode(' '));
  a.appendChild(btn('Obriši','dng',function(){delNews(n)}));r.appendChild(a);L.appendChild(r)})}
function resetForm(){st.edit=null;$('#formTitle').textContent='Nova vijest';$('#nDate').value=today();$('#nTitle').value='';$('#nText').value='';$('#nImg').value='';$('#nRm').checked=false;$('#rmWrap').classList.add('hide');$('#nCancel').classList.add('hide');$('#nSave').textContent='Objavi'}
function editNews(n){st.edit=n;$('#formTitle').textContent='Uređivanje vijesti';$('#nDate').value=n.date;$('#nTitle').value=n.title;$('#nText').value=n.text||'';$('#nImg').value='';$('#nRm').checked=false;
 $('#rmWrap').classList.toggle('hide',!n.image);$('#nCancel').classList.remove('hide');$('#nSave').textContent='Spremi promjene';window.scrollTo({top:0,behavior:'smooth'})}
async function saveNews(){
 var title=$('#nTitle').value.trim(),text=$('#nText').value.trim(),date=$('#nDate').value;
 if(!title||!text||!date){msg('Upišite datum, naslov i tekst.','err');return}
 busy(true,'Objavljujem…');
 try{
  var old=st.edit,id=old?old.id:Date.now().toString(36),it={id:id,date:date,title:title,text:text},f=$('#nImg').files[0];
  if(f){var r=await resize(f,1200,.8),p='assets/img/vijesti/'+slug(title)+'-'+id+'.jpg';await putF(p,r.b64,'Slika vijesti: '+title);it.image=p;if(old&&old.image&&old.image!==p)await delF(old.image,'Uklonjena stara slika vijesti')}
  else if(old&&old.image){if($('#nRm').checked){await delF(old.image,'Uklonjena slika vijesti')}else it.image=old.image}
  st.news=st.news.filter(function(n){return n.id!==id});st.news.push(it);sortNews();
  await saveData(NEWS,'NEWS',st.news,'shaN',(old?'Uređena vijest: ':'Nova vijest: ')+title);
  resetForm();renderNews();msg('Spremljeno. Stranica će se osvježiti za otprilike minutu.','ok')
 }catch(e){msg('Greška: '+e.message,'err')}finally{busy(false)}}
async function delNews(n){
 if(!confirm('Obrisati vijest "'+n.title+'"?'))return;busy(true,'Brišem…');
 try{st.news=st.news.filter(function(x){return x.id!==n.id});await saveData(NEWS,'NEWS',st.news,'shaN','Obrisana vijest: '+n.title);if(n.image)await delF(n.image,'Obrisana slika vijesti');renderNews();msg('Obrisano.','ok')}
 catch(e){msg('Greška: '+e.message,'err')}finally{busy(false)}}

/* ---- galerija ---- */
function renderGal(){var L=$('#gList');L.innerHTML='';
 if(!st.gal.length)L.appendChild(el('p',null,'Galerija je prazna.'));
 st.gal.forEach(function(g){var r=el('div','item'),t=el('div','t'),i=new Image();i.src='../'+g.thumb;i.alt='';t.appendChild(i);t.appendChild(el('strong',null,g.caption));r.appendChild(t);
  var a=el('div');a.appendChild(btn('Uredi opis','sec',function(){renameG(g)}));a.appendChild(document.createTextNode(' '));a.appendChild(btn('Obriši','dng',function(){delG(g)}));r.appendChild(a);L.appendChild(r)})}
async function addG(){
 var files=[].slice.call($('#gFiles').files);if(!files.length){msg('Odaberite barem jednu fotografiju.','err');return}
 var caps=files.map(function(f){var c=f.name.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ').trim();c=c.charAt(0).toUpperCase()+c.slice(1);var v=prompt('Opis za fotografiju "'+f.name+'":',c);return v===null?null:(v.trim()||c)});
 busy(true,'Učitavam fotografije…');var added=[];
 try{
  for(var k=0;k<files.length;k++){if(caps[k]===null)continue;msg('Fotografija '+(k+1)+' od '+files.length+'…','busy');
   var base=slug(caps[k])+'-'+Date.now().toString(36)+k,full=await resize(files[k],1400,.78),th=await resize(files[k],720,.72);
   await putF('assets/img/galerija/full/'+base+'.jpg',full.b64,'Fotografija: '+caps[k]);await putF('assets/img/galerija/thumb/'+base+'.jpg',th.b64,'Mala fotografija: '+caps[k]);
   added.unshift({full:'assets/img/galerija/full/'+base+'.jpg',thumb:'assets/img/galerija/thumb/'+base+'.jpg',w:th.w,h:th.h,alt:caps[k],caption:caps[k]})}
  if(added.length){st.gal=added.concat(st.gal);await saveData(GAL,'GALLERY',st.gal,'shaG','Dodano fotografija: '+added.length)}
  $('#gFiles').value='';renderGal();msg('Spremljeno. Stranica će se osvježiti za otprilike minutu.','ok')
 }catch(e){msg('Greška: '+e.message+(added.length?' (neke su fotografije već učitane, osvježite stranicu i provjerite)':''),'err')}finally{busy(false)}}
async function renameG(g){var v=prompt('Novi opis:',g.caption);if(!v||!v.trim())return;busy(true);
 try{g.caption=v.trim();g.alt=g.caption;await saveData(GAL,'GALLERY',st.gal,'shaG','Uređen opis fotografije');renderGal();msg('Spremljeno.','ok')}catch(e){msg('Greška: '+e.message,'err')}finally{busy(false)}}
async function delG(g){if(!confirm('Obrisati fotografiju "'+g.caption+'"?'))return;busy(true,'Brišem…');
 try{st.gal=st.gal.filter(function(x){return x.full!==g.full});await saveData(GAL,'GALLERY',st.gal,'shaG','Obrisana fotografija: '+g.caption);await delF(g.full,'Obrisana fotografija');await delF(g.thumb,'Obrisana mala fotografija');renderGal();msg('Obrisano.','ok')}
 catch(e){msg('Greška: '+e.message,'err')}finally{busy(false)}}

/* ---- prijava i kartice ---- */
function tab(n){$('#newsPane').classList.toggle('hide',n!=='n');$('#galPane').classList.toggle('hide',n!=='g');$('#tabNews').classList.toggle('on',n==='n');$('#tabGal').classList.toggle('on',n==='g')}
$('#tabNews').addEventListener('click',function(){tab('n')});$('#tabGal').addEventListener('click',function(){tab('g')});
$('#nSave').addEventListener('click',saveNews);$('#nCancel').addEventListener('click',resetForm);$('#gAdd').addEventListener('click',addG);
$('#connect').addEventListener('click',function(){cfg={owner:$('#owner').value.trim(),repo:$('#repo').value.trim(),branch:$('#branch').value.trim()||'main',token:$('#token').value.trim()};
 if(!cfg.owner||!cfg.repo||!cfg.token){msg('Ispunite sva polja.','err');return}
 load().then(function(){if($('#remember').checked)localStorage.setItem('dvd-admin',JSON.stringify(cfg))}).catch(function(e){msg('Greška: '+e.message,'err')})});
$('#logout').addEventListener('click',function(){localStorage.removeItem('dvd-admin');location.reload()});
var saved=null;try{saved=JSON.parse(localStorage.getItem('dvd-admin'))}catch(e){}
var host=location.hostname.match(/^([^.]+)\.github\.io$/),pth=location.pathname.split('/')[1];
$('#owner').value=(saved&&saved.owner)||(host?host[1]:'');$('#repo').value=(saved&&saved.repo)||(host&&pth&&pth!=='admin'?pth:'');$('#branch').value=(saved&&saved.branch)||'main';
resetForm();
if(saved&&saved.token){cfg=saved;load().catch(function(e){msg('Greška: '+e.message,'err')})}
})();
