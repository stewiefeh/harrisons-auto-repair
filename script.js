// Roll-up door entrance
const door = document.querySelector('.door');
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
function ready(){ requestAnimationFrame(() => {
  document.body.classList.add('ready');
  if (door && !prefersReduced){
    door.classList.add('open');
    setTimeout(() => door.classList.add('gone'), 1300);
  }
});}
if (door && !prefersReduced){
  // let the door paint first, then open
  setTimeout(ready, 250);
} else { ready(); if (door) door.classList.add('gone'); }

// Scroll reveals: everything already in view shows immediately,
// so a full-page render or a fast scroll never strands content.
const revealEls = [...document.querySelectorAll('[data-reveal]')];
if ('IntersectionObserver' in window && !prefersReduced){
  const io = new IntersectionObserver((entries) => {
    for (const e of entries){
      if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    }
  }, {threshold: .08});
  for (const el of revealEls){
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0){ el.classList.add('in'); }
    else { el.classList.add('pre'); io.observe(el); }
  }
  // safety net: reveal anything still pending after 4s
  setTimeout(() => revealEls.forEach(el => el.classList.add('in')), 4000);
}

// Live open/closed status, Mountain Time
(function(){
  const dot = document.getElementById('open-dot');
  const label = document.getElementById('open-label');
  const rows = document.querySelectorAll('#hours li');
  if (!dot) return;
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('en-US', {timeZone:'America/Denver', hour:'numeric', minute:'numeric', hour12:true});
  const parts = new Intl.DateTimeFormat('en-US', {timeZone:'America/Denver', weekday:'short', hour:'numeric', hour12:false, hourCycle:'h23'}).formatToParts(now);
  const get = t => parts.find(p => p.type === t)?.value;
  const day = new Map({Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}).get(get('weekday'));
  const hour = +get('hour'), weekday = day >= 1 && day <= 5;
  const open = weekday && hour >= 9 && hour < 17;
  if (open){
    label.textContent = 'Open now \u00B7 closes 5 PM';
  } else if (weekday && hour < 9){
    label.textContent = 'Closed \u00B7 opens 9 AM today';
  } else {
    const names = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const next = day === 5 && hour >= 17 ? 'Monday' : names[(day + 1) % 7].replace('Saturday','Monday').replace('Sunday','Monday');
    label.textContent = 'Closed \u00B7 opens ' + next + ' 9 AM';
  }
  if (!open) dot.classList.add('closed');
  const todayRow = document.querySelector('#hours li[data-day="' + day + '"]');
  if (todayRow) todayRow.classList.add('today');
})();
