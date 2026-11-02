(function(){
var y=document.getElementById('y');if(y)y.textContent=new Date().getFullYear();
var b=document.querySelector('.burger'),n=document.getElementById('nav');
if(!b||!n)return;
b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});
n.addEventListener('click',function(e){if(e.target.tagName==='A'){n.classList.remove('open');b.setAttribute('aria-expanded',false)}});
})();

(function(){var m=document.getElementById('map'),b=document.getElementById('mapBtn');if(!m||!b)return;
b.addEventListener('click',function(){var f=document.createElement('iframe');f.src=m.dataset.src;f.title='Karta: DVD Moslavačka Slatina';f.loading='lazy';m.innerHTML='';m.appendChild(f)})})();
