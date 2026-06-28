// ===== 안현서 Portfolio — shared motion =====
(function(){
  // reveal + hairline draw
  const io = new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},
    {threshold:.12, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal, .draw').forEach(el=>io.observe(el));
  document.querySelectorAll('section, .dhero').forEach(sec=>{
    sec.querySelectorAll('.reveal').forEach((el,i)=>{ el.style.transitionDelay = Math.min(i*65, 320)+'ms'; });
  });

  // highlighter swipe
  const mo = new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){
    setTimeout(()=>e.target.classList.add('lit'), 160 + (+e.target.dataset.i||0)*90); mo.unobserve(e.target);}})},
    {threshold:.9, rootMargin:'0px 0px -10% 0px'});
  document.querySelectorAll('mark').forEach((m,i)=>{ m.dataset.i=i%3; mo.observe(m); });

  // headline line-mask (hero on load, others on scroll)
  const heroLine = document.querySelector('h1 .li') ? document.querySelector('h1') : null;
  window.addEventListener('load', ()=>{
    if(heroLine){ heroLine.querySelectorAll('.li').forEach((li,i)=>li.style.transitionDelay=(120+i*120)+'ms');
      requestAnimationFrame(()=>heroLine.classList.add('ready')); }
  });
  const ho=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){
    e.target.querySelectorAll('.li').forEach((li,i)=>li.style.transitionDelay=(i*120)+'ms');
    e.target.classList.add('ready'); ho.unobserve(e.target);}})},{threshold:.4});
  document.querySelectorAll('h2.big').forEach(el=>ho.observe(el));

  // count-up
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fmt(v,dec){ return dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US'); }
  function runCount(el){
    const to=parseFloat(el.dataset.to), dur=+(el.dataset.dur||1500), dec=+(el.dataset.dec||0);
    const pre=el.dataset.prefix||'', suf=el.dataset.suffix||'', t0=performance.now(), ease=t=>1-Math.pow(1-t,3);
    (function frame(now){ let p=Math.min((now-t0)/dur,1);
      el.textContent=pre+fmt(to*ease(p),dec)+suf;
      if(p<1) requestAnimationFrame(frame); else el.textContent=pre+fmt(to,dec)+suf; })(t0);
  }
  const counts=document.querySelectorAll('.count');
  if(!reduce){
    counts.forEach(el=>{ const dec=+(el.dataset.dec||0); el.textContent=(el.dataset.prefix||'')+fmt(0,dec)+(el.dataset.suffix||''); });
    const co=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){runCount(e.target);co.unobserve(e.target);}})},{threshold:.6});
    counts.forEach(el=>co.observe(el));
  }

  // scroll progress
  const bar=document.getElementById('progress');
  if(bar){ const onScroll=()=>{const h=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=(h>0?window.scrollY/h*100:0)+'%';};
    window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); }
})();

// ===== live design system toggles =====
document.querySelectorAll('.livesys').forEach(function(sys){
  sys.querySelectorAll('[data-toggle]').forEach(function(group){
    var attr = group.getAttribute('data-toggle');
    group.querySelectorAll('[data-v]').forEach(function(btn){
      btn.addEventListener('click', function(){
        sys.setAttribute('data-'+attr, btn.getAttribute('data-v'));
        group.querySelectorAll('[data-v]').forEach(function(x){ x.classList.remove('on'); });
        btn.classList.add('on');
      });
    });
  });
});

// ===== before/after sliders =====
document.querySelectorAll('.ba').forEach(function(ba){
  function setX(clientX){
    var r=ba.getBoundingClientRect();
    var p=(clientX-r.left)/r.width*100; p=Math.max(4,Math.min(96,p));
    ba.style.setProperty('--split', p+'%');
  }
  var on=false;
  ba.addEventListener('pointerdown',function(e){on=true; try{ba.setPointerCapture(e.pointerId);}catch(_){} setX(e.clientX);});
  ba.addEventListener('pointermove',function(e){ if(on) setX(e.clientX); });
  ba.addEventListener('pointerup',function(){on=false;});
  ba.addEventListener('pointercancel',function(){on=false;});
});
