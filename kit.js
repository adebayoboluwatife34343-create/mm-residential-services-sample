/* LeadSky sample kit: small helpers shared by sample builds (no tracking, no network calls). */
window.K=(function(){
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(pointer:fine)').matches;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const wa=(num,t)=>'https://wa.me/'+num+'?text='+encodeURIComponent(t);
function reveal(){
  const els=$$('.rv');
  if(RM||!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'));return}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -5% 0px'});
  els.forEach(e=>io.observe(e));
}
function intro(el,ms){
  if(!el)return;const done=()=>{el.classList.add('done');document.body.classList.add('ready');setTimeout(()=>el.remove(),900)};
  if(RM){done();return}
  setTimeout(done,ms||1800);el.addEventListener('click',done);
}
function magnet(sel){
  if(RM||!fine)return;
  $$(sel||'.mag').forEach(b=>{
    b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.2}px,${(e.clientY-r.top-r.height/2)*.3}px)`});
    b.addEventListener('pointerleave',()=>b.style.transform='');
  });
}
function tilt(sel){
  if(RM||!fine)return;
  $$(sel||'.tilt').forEach(c=>{
    c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(900px) rotateX(${-y*6}deg) rotateY(${x*8}deg) translateY(-3px)`});
    c.addEventListener('pointerleave',()=>c.style.transform='');
  });
}
/* quote form -> wa.me link to the business's own number. Nothing is sent by this page. */
function form(f,o){
  const err=$('.ferr',f),ok=$('.fok',f);
  const msg=()=>{
    const v=n=>(f.elements[n]&&f.elements[n].value||'').trim();
    const lines=[o.greet||('Hi '+o.biz+', I would like a quote.')];
    if(v('name'))lines.push('Name: '+v('name'));
    if(v('service'))lines.push('Job: '+v('service'));
    if(v('area'))lines.push((o.areaLabel||'Area')+': '+v('area'));
    if(v('when'))lines.push('When: '+v('when'));
    if(v('details'))lines.push('Details: '+v('details'));
    return lines.join('\n');
  };
  const prev=$('.fprev',f);const upd=()=>{if(prev)prev.textContent=msg()};
  f.addEventListener('input',upd);f.addEventListener('change',upd);upd();
  f.addEventListener('submit',e=>{
    e.preventDefault();
    const nm=f.elements.name,sv=f.elements.service;
    if(!nm.value.trim()||!sv.value){
      err.textContent=!nm.value.trim()?'Please add your name so the message makes sense.':'Please pick the job you need.';err.hidden=false;ok.hidden=true;(!nm.value.trim()?nm:sv).focus();return}
    err.hidden=true;const url=wa(o.num,msg());ok.hidden=false;
    window.__lastWa=url;
    const w=window.open(url,'_blank','noopener');if(!w)location.href=url;
  });
  return {msg,wa:()=>wa(o.num,msg())};
}
function waLinks(o){
  $$('[data-wa]').forEach(a=>{a.href=wa(o.num,a.dataset.wa||o.greet);a.target='_blank';a.rel='noopener'});
}
function scrollP(el){const r=el.getBoundingClientRect();return Math.min(1,Math.max(0,-r.top/Math.max(1,el.offsetHeight-innerHeight)))}
function smooth(){ $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=$(a.getAttribute('href'));if(!t)return;e.preventDefault();t.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'});t.setAttribute('tabindex','-1');setTimeout(()=>t.focus({preventScroll:true}),400)}))}
return {RM,fine,$,$$,wa,reveal,intro,magnet,tilt,form,waLinks,scrollP,smooth};
})();
