// Democratic Taste — site mockup: shared header, footer and helpers.
// Rule from the label: everything black, only the candies (= the covers) are coloured.
window.DT = (function(){
  const R = window.DT_RELEASES;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const candy = c => `<svg class="candy" viewBox="0 0 40 20" aria-hidden="true"><path d="M1 3 11 10 1 17Z" fill="${c}"/><path d="M39 3 29 10 39 17Z" fill="${c}"/><ellipse cx="20" cy="10" rx="10.5" ry="7.5" fill="${c}"/><ellipse cx="16.5" cy="7.2" rx="3.6" ry="1.7" fill="#fff" opacity=".5"/></svg>`;

  // artists: split collabs, count releases, keep each artist's releases
  const names = r => r.artist.split(/,| & /).map(s => s.trim()).filter(Boolean);
  const byArtist = {};
  R.forEach((r,i) => names(r).filter(n => n !== 'Various Artists').forEach(n => (byArtist[n] = byArtist[n] || []).push(i)));
  const slug = n => n.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const artists = Object.keys(byArtist).sort((a,b) => a.localeCompare(b, 'es', {sensitivity:'base'}));

  const pages = [
    ['releases.html', 'Releases', `(${R.length})`],
    ['artists.html',  'Artists',  `(${artists.length})`],
    ['../',           'Factory',  ''],
    ['about.html',    'About',    ''],
  ];

  function header(active){
    return `
    <div class="ticker" aria-hidden="true"><div class="track">${[0,1].map(() => R.slice(0,8).map((r,i) =>
      `<span>${candy(r.color)} ${i===0?'<b>NOW COOKING ▸</b> ':''}<b>${r.cat}</b> ${esc(r.title)} — ${esc(r.artist)}</span>`).join('') +
      `<span>${candy('#f1eee9')} fine selected candy for your ears</span>`).join('')}</div></div>
    <header class="top">
      <a class="mark" href="index.html"><span class="logo">DT</span><span class="word">Democratic<br>Taste<small>CDMX · EST. 2020</small></span></a>
      <nav class="boxes nav">
        ${pages.map(([h,l,n]) => `<a class="${active===h?'on':''}" href="${h}">${l}${n?`<sup>${n}</sup>`:''}</a>`).join('')}
        <a class="demo" href="about.html#demos">Send demos</a>
      </nav>
      <nav class="boxes lang"><a class="on" href="#">ES</a><a href="#">EN</a></nav>
      <button class="menu-btn" aria-label="Menú" aria-expanded="false"><i></i></button>
    </header>`;
  }

  function footer(){
    return `
    <footer class="foot">
      <div class="foot-big">fine selected<br>candy for your ears ${candy('#f1eee9')}</div>
      <div class="foot-cols">
        <div><em>Escuchar</em>
          <a href="https://democratictaste.bandcamp.com" target="_blank" rel="noopener">Bandcamp</a>
          <a href="https://soundcloud.com/democratictaste" target="_blank" rel="noopener">SoundCloud</a>
          <a href="#">Spotify</a><a href="#">Beatport</a><a href="#">YouTube</a></div>
        <div><em>Sello</em>
          <a href="releases.html">Releases</a><a href="artists.html">Artists</a><a href="about.html">About</a><a href="about.html#demos">Send demos</a></div>
        <div><em>Social</em>
          <a href="https://instagram.com/democratictaste" target="_blank" rel="noopener">Instagram</a></div>
      </div>
      <div class="foot-base"><span>© Democratic Taste · Ciudad de México</span><span>All genres, no judgement.</span></div>
    </footer>
    <div class="mock-note">Mockup · logo 3D = render provisional</div>`;
  }

  // phone menu
  document.addEventListener('click', e => {
    const b = e.target.closest('.menu-btn');
    const hdr = document.querySelector('header.top');
    if (!hdr) return;
    if (b){ const open = hdr.classList.toggle('open'); b.setAttribute('aria-expanded', open); }
    else if (!e.target.closest('.boxes.nav')) hdr.classList.remove('open');
  });

  function mount(active){
    document.getElementById('hdr').innerHTML = header(active);
    document.getElementById('ftr').innerHTML = footer();
  }
  return {R, esc, candy, names, byArtist, artists, slug, mount};
})();
