(function(){
const {RM,$,$$}=K;
K.intro($('#intro'),1700);K.reveal();K.magnet('.mag');K.smooth();
const NUM='12403186587';
K.waLinks({num:NUM,greet:'Hi M&M Residential Services, I found you online and would like a quote.'});
const F=K.form($('#qf'),{num:NUM,biz:'M&M Residential Services',areaLabel:'ZIP code or town',greet:'Hi M&M Residential Services, I would like a quote.'});window.__form=F;
$$('.pick').forEach(b=>b.addEventListener('click',()=>{const s=$('#qf').elements.service;s.value=b.dataset.job;s.dispatchEvent(new Event('change',{bubbles:true}));$('#quote').scrollIntoView({behavior:RM?'auto':'smooth'});setTimeout(()=>$('#qf').elements.name.focus({preventScroll:true}),500)}));
/* open pill: Eastern time, hours from their public page */
const H={1:[7,19],2:[8,19],3:[8,19],4:[8,19],5:[8,19],6:null,0:null};
function et(){const p=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());const g=t=>p.find(x=>x.type===t).value;return {d:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),m:(+g('hour')%24)*60+(+g('minute'))}}
function pill(){const t=et(),h=H[t.d],o=!!h&&t.m>=h[0]*60&&t.m<h[1]*60;$('#open').classList.toggle('open',o);$('#openTxt').textContent=o?'Open now':'Closed now';$('#open').title='Hours from their public Nextdoor page, Eastern time'}pill();setInterval(pill,60000);
const secs=['top','services','hours','quote'].map(id=>[id,document.getElementById(id)]);const links=$$('.seg a');
const hl=()=>{let cur='top';secs.forEach(([id,el])=>{if(el.getBoundingClientRect().top<innerHeight*.5)cur=id});links.forEach(a=>a.classList.toggle('on',a.dataset.s===cur))};addEventListener('scroll',hl,{passive:true});hl();
/* gutter controls */
const G=window.GUTTER={c:0,rain:true};const sl=$('#gc'),out=$('#gco');
const set=v=>{G.c=Math.max(0,Math.min(100,v));sl.value=G.c;out.textContent=G.c<20?'Blocked':G.c<75?'Clearing':'Clear';G.draw&&G.draw()};
sl.addEventListener('input',()=>{G.user=1;set(+sl.value)});
$('#clear').onclick=()=>{G.user=1;if(RM){set(100);return}let v=G.c;const go=()=>{v+=2;set(v);if(v<100)requestAnimationFrame(go)};go()};
$('#clog').onclick=()=>{G.user=1;set(0)};
$('#rain').onclick=function(){G.rain=!G.rain;this.setAttribute('aria-pressed',G.rain);this.textContent='Rain: '+(G.rain?'on':'off');G.draw&&G.draw()};
if(RM){G.rain=false;$('#rain').setAttribute('aria-pressed','false');$('#rain').textContent='Rain: off'}
if(!RM){setTimeout(()=>{if(!G.user){let v=0;const go=()=>{if(G.user)return;v+=.5;set(v);if(v<100)requestAnimationFrame(go)};go()}},3200)}
})();
