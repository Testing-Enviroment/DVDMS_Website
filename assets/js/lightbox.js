(function(){
var d=document.createElement('dialog');d.setAttribute('aria-label','Povećana slika');
d.innerHTML='<button class="x" aria-label="Zatvori">×</button><button class="nav prev" aria-label="Prethodna slika">‹</button><img alt=""><p class="cap"></p><button class="nav next" aria-label="Sljedeća slika">›</button>';
document.body.appendChild(d);
var items=[],i=0,img=d.querySelector('img'),cap=d.querySelector('.cap');
function show(n){i=(n+items.length)%items.length;img.src=items[i].full;img.alt=items[i].alt||'';cap.textContent=items[i].caption||'';d.classList.toggle('single',items.length<2)}
window.openLightbox=function(list,n){items=list;show(n);d.showModal()};
d.addEventListener('click',function(e){var t=e.target;if(t.classList.contains('prev'))show(i-1);else if(t.classList.contains('next'))show(i+1);else if(t!==img)d.close()});
document.addEventListener('keydown',function(e){if(!d.open)return;if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1)});
})();
