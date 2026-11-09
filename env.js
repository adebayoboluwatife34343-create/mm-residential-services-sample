/* tiny studio environment for reflections, built from emissive panels (no external files) */
export function makeEnv(THREE,renderer,o={}){
  const s=new THREE.Scene();
  const bgc=new THREE.Color(o.bg||0x14141a);
  s.background=bgc;
  const mk=(w,h,c,i,x,y,z,rx=0,ry=0)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(c).multiplyScalar(i),side:THREE.DoubleSide}));m.position.set(x,y,z);m.rotation.set(rx,ry,0);s.add(m)};
  const L=o.lights||[[0xffffff,6],[0xffe2c0,3],[0x9fb4ff,2.5]];
  mk(10,3,L[0][0],L[0][1],0,6,2,Math.PI/2);          // top softbox
  mk(3,8,L[1][0],L[1][1],-7,1,2,0,Math.PI/2);        // left strip
  mk(3,8,L[2][0],L[2][1],7,1,-1,0,Math.PI/2);        // right strip
  mk(12,2,L[0][0],L[0][1]*.5,0,0,-8);               // back strip
  const pm=new THREE.PMREMGenerator(renderer);const t=pm.fromScene(s,.04).texture;pm.dispose();return t;
}
