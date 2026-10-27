'use strict';
const header = document.getElementById('site-header');
const menuButton = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuLinks = [...mobileMenu.querySelectorAll('a')];
const setMenu = (open) => {
  mobileMenu.classList.toggle('open',open);
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');
  mobileMenu.inert = !open;
  document.body.style.overflow = open ? 'hidden' : '';
};
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
menuLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
window.addEventListener('keydown', e => { if(e.key==='Escape') setMenu(false); });
window.addEventListener('resize', () => { if(window.innerWidth > 990) setMenu(false); });
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 18), {passive:true});

const therapyData = {
  cardiology: {label:'Cardiology',description:'Advancing access to pharmaceutical solutions within cardiovascular care.',url:'https://www.alkemlabs.com/our-offerings/cardiology',color:'linear-gradient(145deg,#e6f5ff 0%,#d6eefe 100%)',svg:'<path d="M125 204s-84-55-84-116a49 49 0 0 1 84-34 49 49 0 0 1 84 34c0 61-84 116-84 116Z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M50 119h46l14-30 24 61 21-40 12 9h32" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>'},
  gastroenterology: {label:'Gastroenterology',description:'A portfolio focused on digestive health and gastrointestinal conditions.',url:'https://www.alkemlabs.com/our-offerings/gastroenterology',color:'linear-gradient(145deg,#e6fbf8 0%,#daf3eb 100%)',svg:'<path d="M122 44v53c0 19 22 19 30 6 7-13 10-27 28-27 29 0 42 36 22 63-21 28-53 45-89 38-36-7-61-33-61-65 0-21 6-37 24-46 12-7 21 4 23 23V44" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'},
  dermatology: {label:'Dermatology',description:'Supporting the needs of skin health with accessible pharmaceutical care.',url:'https://www.alkemlabs.com/our-offerings/dermatology',color:'linear-gradient(145deg,#f0efff 0%,#e4e8ff 100%)',svg:'<path d="M125 34c-52 0-78 32-78 76 0 50 31 94 78 94 47 0 78-44 78-94 0-44-26-76-78-76Z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M94 114h4m54 0h4M106 148c13 13 31 13 44 0M105 76c-7-8-15-10-23-4m70 4c7-8 15-10 23-4" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'},
  neurology: {label:'Neurology',description:'Therapies addressing important needs in neurological healthcare.',url:'https://www.alkemlabs.com/our-offerings/neurology',color:'linear-gradient(145deg,#fff1e9 0%,#ffebdc 100%)',svg:'<path d="M123 45c-16-23-50-9-49 17-28-2-42 26-27 46-17 20-3 51 20 50 0 24 30 35 50 20V58m11-13c16-23 50-9 49 17 28-2 42 26 27 46 17 20 3 51-20 50 0 24-30 35-50 20V58" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M94 84c20 0 20 26 29 26m33-26c-20 0-20 26-29 26M77 135c21-3 32-2 45 16m50-16c-21-3-32-2-45 16" fill="none" stroke="currentColor" stroke-width="3"/>'},
  diabetology: {label:'Diabetology',description:'A focus on medicines supporting the management of diabetes and related needs.',url:'https://www.alkemlabs.com/our-offerings/diabetology',color:'linear-gradient(145deg,#e7f9fb 0%,#cfedf3 100%)',svg:'<path d="M125 29s-72 85-72 119a72 72 0 0 0 144 0c0-34-72-119-72-119Z" fill="none" stroke="currentColor" stroke-width="4"/><path d="M92 150h66m-33-33v66" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>'}
};
const tabs = [...document.querySelectorAll('[data-therapy]')];
const panel = document.getElementById('therapy-display');
const setTherapy = (name,focus) => {
  const current = therapyData[name]; if(!current)return;
  tabs.forEach(tab => {const active=tab.dataset.therapy===name;tab.setAttribute('aria-selected', String(active));tab.tabIndex=active?0:-1;if(active&&focus)tab.focus();});
  document.getElementById('therapy-name').textContent=current.label;
  document.getElementById('therapy-description').textContent=current.description;
  const link=document.getElementById('therapy-link');link.href=current.url;link.setAttribute('aria-label','Explore '+current.label+' on the official Alkem website');
  document.getElementById('therapy-num').textContent=String(tabs.findIndex(t=>t.dataset.therapy===name)+1).padStart(2,'0')+' / 05';
  panel.style.background=current.color;
  panel.querySelector('.therapy-illustration svg').innerHTML=current.svg;
};
tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>setTherapy(tab.dataset.therapy,false));
  tab.addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowDown'||e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;setTherapy(tabs[next].dataset.therapy,true);});
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window && !reduceMotion){const revealObserver=new IntersectionObserver((entries,observer)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.12,rootMargin:'0px 0px 40px 0px'});reveals.forEach(el=>revealObserver.observe(el));} else {reveals.forEach(el=>el.classList.add('visible'));}
if('IntersectionObserver' in window && !reduceMotion){const metrics=document.querySelector('.metrics');const countObserver=new IntersectionObserver((entries,observer)=>{if(!entries[0].isIntersecting)return;document.querySelectorAll('[data-count]').forEach(el=>{const to=Number(el.dataset.count);const duration=1350;const start=performance.now();const frame=now=>{const prog=Math.min(1,(now-start)/duration);const eased=1-(1-prog)**3;el.textContent=Math.floor(to*eased).toLocaleString('en-IN');if(prog<1)requestAnimationFrame(frame);};requestAnimationFrame(frame);});observer.disconnect();},{threshold:.3});countObserver.observe(metrics);}
document.getElementById('year').textContent=String(new Date().getFullYear());
