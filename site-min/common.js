// Democratic Taste — MINIMAL site mockup: shared header/footer + helpers.
window.DT = (function(){
  const R = window.DT_RELEASES;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const candy = c => `<svg class="candy" viewBox="0 0 40 20" aria-hidden="true"><path d="M1 3 11 10 1 17Z" fill="${c}"/><path d="M39 3 29 10 39 17Z" fill="${c}"/><ellipse cx="20" cy="10" rx="10.5" ry="7.5" fill="${c}"/></svg>`;
  const names = r => r.artist.split(/,| & /).map(s => s.trim()).filter(Boolean);
  const byArtist = {};
  R.forEach((r,i) => names(r).filter(n => n !== 'Various Artists').forEach(n => (byArtist[n] = byArtist[n] || []).push(i)));
  const slug = n => n.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const artists = Object.keys(byArtist).sort((a,b) => a.localeCompare(b, 'es', {sensitivity:'base'}));

  const pages = [['releases.html','Releases'],['artists.html','Artists'],['../','Factory'],['about.html','About']];

  function header(active){
    return `<header class="top">
      <a class="mark" href="index.html">Democratic Taste</a>
      <nav class="nav">${pages.map(([h,l]) => `<a class="${active===h?'on':''}" href="${h}">${l}</a>`).join('')}</nav>
      <nav class="lang"><a class="on" href="#">ES</a><a href="#">EN</a></nav>
      <button class="menu-btn" aria-expanded="false">Menú</button>
    </header>`;
  }
  function footer(){
    return `<footer class="foot">
      <div class="foot-top">
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
        <div class="foot-tag">
          <div class="foot-big">Custom-wrapped<br>electronic music <button class="flavor-candy" id="flavorCandy" aria-label="Otro sabor" title="Otro sabor">${candy('#ece9e4')}</button></div>
          <p class="foot-sub">A different flavor for every palate.</p>
          <a class="flavor" id="flavor" href="releases.html"></a>
        </div>
      </div>
      <div class="foot-base"><span>© Democratic Taste · Tasty Tunes Factory · CDMX</span><span>All genres, no judgement.</span></div>
    </footer>`;
  }
  // "a different flavor for every palate": a random release flavours the footer candy; click for another
  function flavor(){
    const btn = document.getElementById('flavorCandy'), link = document.getElementById('flavor');
    if (!btn) return;
    let last = -1;
    const pick = () => {
      let i; do { i = Math.floor(Math.random() * R.length); } while (i === last && R.length > 1); last = i;
      const r = R[i];
      btn.style.setProperty('--fc', r.color);
      link.style.setProperty('--fc', r.color);
      link.href = `releases.html#${r.cat}`;
      link.innerHTML = `<span class="mono mute">Tu sabor de hoy</span> <span class="fl-t">${esc(r.title)}</span> <span class="mute">— ${esc(r.artist)}</span> <span class="mono mute">${r.cat} →</span>`;
    };
    pick();
    btn.addEventListener('click', () => { btn.classList.remove('twist'); void btn.offsetWidth; btn.classList.add('twist'); pick(); });
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('.menu-btn'), hdr = document.querySelector('header.top');
    if (!hdr) return;
    if (b){ const o = hdr.classList.toggle('open'); b.textContent = o ? 'Cerrar' : 'Menú'; b.setAttribute('aria-expanded', o); }
  });
  function mount(active){
    document.getElementById('hdr').innerHTML = header(active);
    document.getElementById('ftr').innerHTML = footer();
    flavor();
  }
  return {R, esc, candy, names, byArtist, artists, slug, mount};
})();
