import * as THREE from './three.module.js';
import {makeEnv} from './env.js';
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const cv=document.getElementById('c3d'),box=cv.parentElement;
let r;try{r=new THREE.WebGLRenderer({canvas:cv,antialias:true})}catch(e){document.getElementById('nowebgl').hidden=false;throw e}
r.setPixelRatio(Math.min(devicePixelRatio,2));r.toneMapping=THREE.ACESFilmicToneMapping;r.outputColorSpace=THREE.SRGBColorSpace;
const sc=new THREE.Scene();sc.background=new THREE.Color(0x0c0f0c);sc.fog=new THREE.Fog(0x0c0f0c,16,34);sc.environment=makeEnv(THREE,r,{bg:0x1b241a,lights:[[0xf0ffe0,5],[0xb6ff3c,3],[0xffffff,3]]});
const cam=new THREE.PerspectiveCamera(34,1,.1,60);
const key=new THREE.DirectionalLight(0xfff6e0,2.2);key.position.set(-4,6,8);sc.add(key);sc.add(new THREE.HemisphereLight(0xcdeaff,0x1a2a14,.8));
const lime=new THREE.PointLight(0xb6ff3c,5,14,1.7);lime.position.set(4,-1,3);sc.add(lime);
const W=new THREE.Group();sc.add(W);
const L=11;
/* wall + fascia */
const wall=new THREE.Mesh(new THREE.BoxGeometry(L+2,5,.5),new THREE.MeshStandardMaterial({color:0x2c322b,roughness:.95}));wall.position.set(0,-2.1,-.6);W.add(wall);
const fascia=new THREE.Mesh(new THREE.BoxGeometry(L+1,.5,.12),new THREE.MeshStandardMaterial({color:0xe9ede6,roughness:.5}));fascia.position.set(0,.55,-.28);W.add(fascia);
/* roof */
const sg=document.createElement('canvas');sg.width=256;sg.height=256;const sx=sg.getContext('2d');sx.fillStyle='#3a3f3b';sx.fillRect(0,0,256,256);for(let j=0;j<8;j++){for(let i=0;i<8;i++){const o=j%2?16:0;const v=48+((i*7+j*13)%5)*6;sx.fillStyle=`rgb(${v},${v+4},${v+2})`;sx.fillRect(i*32+o,j*32,30,30)}}
const st=new THREE.CanvasTexture(sg);st.wrapS=st.wrapT=THREE.RepeatWrapping;st.repeat.set(5,2);st.colorSpace=THREE.SRGBColorSpace;
const roof=new THREE.Mesh(new THREE.BoxGeometry(L+1.4,.18,3.4),new THREE.MeshStandardMaterial({map:st,roughness:.9}));roof.position.set(0,1.3,.1);roof.rotation.x=-.35;W.add(roof);
/* gutter profile (half round) */
const prof=new THREE.Shape();const R=.62;prof.absarc(0,0,R,Math.PI,2*Math.PI,false);prof.lineTo(R-.07,0);prof.absarc(0,0,R-.07,2*Math.PI,Math.PI,true);prof.closePath();
const gg=new THREE.ExtrudeGeometry(prof,{depth:L,bevelEnabled:false,curveSegments:28});gg.rotateY(Math.PI/2);gg.translate(-L/2,0,0);
const gut=new THREE.Mesh(gg,new THREE.MeshStandardMaterial({color:0xaeb8be,metalness:.85,roughness:.32,side:THREE.DoubleSide}));gut.position.set(0,0,.55);W.add(gut);
const lip=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,L,10),gut.material);lip.rotation.z=Math.PI/2;lip.position.set(0,0,.55+R);W.add(lip);const lip2=lip.clone();lip2.position.z=.55-R;W.add(lip2);
/* downspout */
const DX=4.9;const spout=new THREE.Mesh(new THREE.BoxGeometry(.5,5,.3),gut.material);spout.position.set(DX,-2.6,.2);W.add(spout);
const cap=new THREE.Mesh(new THREE.CylinderGeometry(.26,.26,.3,16,1,true),new THREE.MeshBasicMaterial({color:0x000}));cap.position.set(DX,-.12,.55);W.add(cap);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(40,14),new THREE.MeshStandardMaterial({color:0x1b3a12,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.set(0,-5.1,3);W.add(ground);
/* leaves */
const NL=140,leaves=[];const lc=[0x7a5a1c,0xa8741f,0x5e4a14,0x8c3d12,0x6e7a1c,0xb0892a];
const lgeo=new THREE.ShapeGeometry((()=>{const s=new THREE.Shape();s.moveTo(0,.2);s.bezierCurveTo(.16,.12,.16,-.1,0,-.2);s.bezierCurveTo(-.16,-.1,-.16,.12,0,.2);return s})());
for(let i=0;i<NL;i++){const m=new THREE.Mesh(lgeo,new THREE.MeshStandardMaterial({color:lc[i%lc.length],roughness:.9,side:THREE.DoubleSide}));
 const x=(Math.random()+Math.random()-1)*3.3+.6;m.userData={x,z:.55+(Math.random()-.5)*.7,y:-.5+Math.random()*.38+Math.max(0,.35-Math.abs(x-.6)*.1),th:i/NL,rx:Math.random()*6,ry:Math.random()*6,rz:Math.random()*6,v:new THREE.Vector3((Math.random()-.4)*.8,Math.random()*.6,(Math.random()-.2)*.9)};
 m.scale.setScalar(1.5+Math.random()*1);W.add(m);leaves.push(m)}
/* water */
const NW=260,wg=new THREE.BufferGeometry(),wp=new Float32Array(NW*3),wst=[];for(let i=0;i<NW;i++){wst.push({s:0,x:(Math.random()-.5)*L*.9,y:.9+Math.random()*3,z:.6+Math.random()*.5,sp:.05+Math.random()*.04})}
wg.setAttribute('position',new THREE.BufferAttribute(wp,3));const water=new THREE.Points(wg,new THREE.PointsMaterial({color:0xbfe6ff,size:.09,transparent:true,opacity:.9,depthWrite:false}));water.frustumCulled=false;W.add(water);
/* state */
let yaw=-.28,pitch=.12,ty=-.28,tp=.1,drag=null,vis=true,t=0;
const S=()=>window.GUTTER||{c:0,rain:true};
function clogAmt(){return 1-Math.min(1,S().c/80)}
function placeLeaves(){const c=S().c/100;leaves.forEach(m=>{const u=m.userData;const k=Math.max(0,c*1.25-u.th*.9);const lift=k;m.position.set(u.x+u.v.x*lift*4,u.y+lift*lift*8+u.v.y*lift*3,u.z+u.v.z*lift*4);m.rotation.set(u.rx+lift*6,u.ry+lift*4,u.rz);const sc_=Math.max(0,1-Math.max(0,lift-.5)*2);m.scale.setScalar((1.5+(u.th*1))*sc_)})}
function stepWater(){const p=wg.attributes.position.array,clog=clogAmt(),on=S().rain;for(let i=0;i<NW;i++){const q=wst[i];
  if(!on&&!RM){p[i*3+1]=-99;continue}
  if(q.s===0){q.y-=q.sp*1.6;if(q.y<=-.55){q.y=-.55;q.s=(clog>.35&&Math.abs(q.x-.6)<3.6&&Math.random()<clog)?2:1}}
  else if(q.s===1){q.x+=.07;if(q.x>DX){q.s=3;q.x=DX}}
  else if(q.s===2){q.y-=.09;q.z+=.012;if(q.y<-5){q.s=0;q.y=1+Math.random()*3;q.x=(Math.random()-.5)*L*.9;q.z=.6+Math.random()*.4}}
  else if(q.s===3){q.y-=.12;if(q.y<-5){q.s=0;q.y=1+Math.random()*3;q.x=(Math.random()-.5)*L*.9;q.z=.6+Math.random()*.4}}
  const zz=q.s===2?Math.max(q.z,1.15):q.s===3?.4:q.z;p[i*3]=q.x;p[i*3+1]=q.y;p[i*3+2]=zz}
  wg.attributes.position.needsUpdate=true}
function size(){const w=box.clientWidth,h=box.clientHeight;r.setSize(w,h,false);cam.aspect=w/h;const n=w/h<.85;cam.fov=n?52:34;cam.position.set(0,n?1.5:.8,n?30:19.5);cam.lookAt(0,-2.1,0);cam.updateProjectionMatrix();if(RM)draw()}
function draw(){placeLeaves();W.rotation.set(pitch,yaw,0);r.render(sc,cam)}
function loop(){if(vis){yaw+=(ty-yaw)*.08;pitch+=(tp-pitch)*.08;t+=.016;stepWater();draw()}requestAnimationFrame(loop)}
window.GUTTER=Object.assign(window.GUTTER||{c:0,rain:true},{draw:()=>{if(RM)draw()}});
new ResizeObserver(size).observe(box);new IntersectionObserver(es=>{vis=es[0].isIntersecting}).observe(box);
cv.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointermove',e=>{if(drag){ty=Math.max(-.9,Math.min(.9,ty+(e.clientX-drag.x)*.008));tp=Math.max(-.25,Math.min(.5,tp+(e.clientY-drag.y)*.004));drag={x:e.clientX,y:e.clientY};if(RM)draw()}else if(!RM&&matchMedia('(pointer:fine)').matches){const b=cv.getBoundingClientRect();ty=-.28+((e.clientX-b.left)/b.width-.5)*.5;tp=.1+((e.clientY-b.top)/b.height-.5)*.2}});
cv.addEventListener('pointerup',()=>drag=null);cv.addEventListener('pointercancel',()=>drag=null);
cv.tabIndex=0;cv.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')ty-=.15;if(e.key==='ArrowRight')ty+=.15;if(RM)draw()});
size();draw();if(!RM)requestAnimationFrame(loop);window.__gutter=true;
