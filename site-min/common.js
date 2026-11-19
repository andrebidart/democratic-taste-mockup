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

  // header = option A (logo + candy on the active page) + option B (tagline under the name, counts, newest release)
  function header(active){
    const h = R[0];
    const counts = {'releases.html': R.length, 'artists.html': artists.length};
    const showNew = active !== 'index.html' && active !== 'releases.html';   // those pages already lead with the newest release
    return `<header class="top">
      <a class="mark" href="index.html" aria-label="Democratic Taste — inicio"><img src="img/logo-letras.png" alt="Democratic Taste"><small>Tasty Tunes<br>Factory · CDMX</small></a>
      <nav class="nav">${pages.map(([u,l]) => `<a class="${active===u?'on':''}" href="${u}">${candy(h.color)}${l}${counts[u]?`<sup>${counts[u]}</sup>`:''}</a>`).join('')}</nav>
      ${showNew ? `<a class="new" href="releases.html#${h.cat}"><img src="${h.img}" alt=""><span><span class="mono mute">Nuevo</span><br>${esc(h.title)}</span></a>` : ''}
      <button class="menu-btn" aria-expanded="false">Menú</button>
    </header>`;
  }
  // footer = option B, the wrapper label ("nutrition facts" for the label)
  // other pages: the same label, shrunk to one strip + one row of links
  function footerMini(){
    const h = R[0];
    return `<footer class="foot-mini">
      <div class="strip">
        <a class="strip-name" href="index.html">Democratic Taste</a>
        <span><em>Ingredientes</em>${artists.length} artistas</span>
        <span><em>Sabor</em>Las rolas</span>
        <span><em>Envoltura</em>${R.length} artistas visuales</span>
        <span><em>Hecho en</em>CDMX, 2020</span>
        <a class="strip-lot" href="releases.html#${h.cat}"><em>Lote</em>${h.cat} ${candy(h.color)}</a>
      </div>
      <div class="mini-base">
        <nav><a href="https://democratictaste.bandcamp.com" target="_blank" rel="noopener">Bandcamp</a><a href="https://soundcloud.com/democratictaste" target="_blank" rel="noopener">SoundCloud</a><a href="#">Spotify</a><a href="https://instagram.com/democratictaste" target="_blank" rel="noopener">Instagram</a><a href="about.html#demos">Send demos</a></nav>
        <span>© Democratic Taste · Custom-wrapped electronic music</span>
        <nav class="lang"><a class="on" href="#">ES</a><a href="#">EN</a></nav>
      </div>
    </footer>`;
  }
  function footer(){
    const h = R[0];
    const listen = `<a href="https://democratictaste.bandcamp.com" target="_blank" rel="noopener">Bandcamp</a><a href="https://soundcloud.com/democratictaste" target="_blank" rel="noopener">SoundCloud</a><a href="#">Spotify</a><a href="#">Beatport</a><a href="#">YouTube</a>`;
    return `<footer class="foot">
      <div class="foot-left"><p class="foot-big">Custom-wrapped<br>electronic music</p>
        <div class="foot-cols"><div><em>Escuchar</em>${listen}</div>
          <div><em>Sello</em><a href="releases.html">Releases</a><a href="artists.html">Artists</a><a href="about.html">About</a><a href="about.html#demos">Send demos</a></div>
          <div><em>Social</em><a href="https://instagram.com/democratictaste" target="_blank" rel="noopener">Instagram</a></div></div></div>
      <div class="wrap-label">
        <h3>Democratic Taste</h3>
        <div class="sub">Tasty Tunes Factory · contenido: ${R.length} sabores</div>
        <dl>
          <div><dt>Ingredientes</dt><dd>${artists.length} artistas + sus instrumentos</dd></div>
          <div><dt>Sabor</dt><dd>Las rolas</dd></div>
          <div><dt>Envoltura</dt><dd>${R.length} artistas visuales</dd></div>
          <div><dt>Hecho en</dt><dd>CDMX, desde 2020</dd></div>
        </dl>
        <div class="may">Puede contener house, disco, breaks, techno y ambient.</div>
        <a class="lot" href="releases.html#${h.cat}"><span>Lote ${h.cat}</span>${candy(h.color)}</a>
      </div>
      <div class="foot-base"><span>© Democratic Taste · CDMX</span><span>All genres, no judgement.</span><nav class="lang"><a class="on" href="#">ES</a><a href="#">EN</a></nav></div>
    </footer>`;
  }
  // "tu sabor de hoy": a random release, click the candy for another. Mounts wherever a #sabor element exists.
  function sabor(){
    const el = document.getElementById('sabor');
    if (!el) return;
    el.innerHTML = `<a class="sb-img" href="#"><img alt=""></a>
      <div class="sb-txt"><span class="mono mute">Tu sabor de hoy · <span class="sb-cat"></span></span><div class="sb-t"></div><div class="sb-a mute"></div></div>
      <div class="sb-acts"><a class="link sb-go" href="#">Probar →</a><button class="sb-shuffle">Otro sabor <span class="sb-c"></span></button></div>`;
    const q = s => el.querySelector(s);
    let last = -1;
    const pick = () => {
      let i; do { i = Math.floor(Math.random() * R.length); } while (i === last && R.length > 1); last = i;
      const r = R[i], url = `releases.html#${r.cat}`;
      q('.sb-img img').src = r.img; q('.sb-img').href = q('.sb-go').href = url;
      q('.sb-cat').textContent = r.cat; q('.sb-t').textContent = r.title;
      q('.sb-a').textContent = r.artist + (r.art ? ' · Wrap ' + r.art : '');
      q('.sb-c').innerHTML = candy(r.color); q('.sb-go').style.setProperty('--c', r.color);
    };
    pick();
    q('.sb-shuffle').addEventListener('click', pick);
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('.menu-btn'), hdr = document.querySelector('header.top');
    if (!hdr) return;
    if (b){ const o = hdr.classList.toggle('open'); b.textContent = o ? 'Cerrar' : 'Menú'; b.setAttribute('aria-expanded', o); }
  });
  function mount(active){
    document.getElementById('hdr').innerHTML = header(active);
    document.getElementById('ftr').innerHTML = active === 'index.html' ? footer() : footerMini();
    sabor();
  }
  return {R, esc, candy, names, byArtist, artists, slug, mount};
})();
