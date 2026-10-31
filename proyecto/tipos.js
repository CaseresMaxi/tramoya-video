// Tipos de escena propios del video explicativo (tomados del tutorial). Se suman a los de motion/tipos.js.
//
//   captura  una pantalla real con marcas numeradas: cada avance destaca una
//   hitos    una línea de tiempo con pasos, que se recorre de a uno por avance
(function () {
  if (!window.MOTION) return; // el reel también carga este archivo
  const { md, esc, pairs, lines } = window.TRAMOYA;
  const { kicker, titulo, modo } = window.MOTION.helpers;

  window.TIPOS_PROYECTO = {
    captura: {
      nombre: 'Captura con marcas', pasos: 'uno',
      campos: [['kicker', 'text', 'Antetítulo'], ['titulo', 'area', 'Título'], ['imagen', 'image', 'Captura (16:9)'],
        ['marcas', 'lines', 'Marcas: "x | y | texto" por línea (x e y en % de la captura)'], ['url', 'text', 'Texto de la barra del navegador']],
      ejemplo: { kicker: 'Pantalla', titulo: 'Qué hay *acá*.', marcas: '20 | 30 | Primera cosa\n70 | 60 | Segunda cosa' },
      css: `
        .cap-frame{position:absolute; left:140px; top:286px; width:1160px; height:686px; border-radius:18px; overflow:hidden; background:var(--panel); border:1px solid var(--line); box-shadow:0 30px 80px rgba(0,0,0,.45)}
        .cap-bar{height:34px; display:flex; align-items:center; gap:8px; padding:0 16px; background:var(--panel-2); border-bottom:1px solid var(--line); font:500 15px var(--font-body); color:var(--muted)}
        .cap-bar i{width:11px; height:11px; border-radius:50%; background:var(--line)}
        .cap-bar span{margin-left:14px; padding:3px 14px; border-radius:20px; background:var(--bg); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:700px}
        .cap-img{position:absolute; left:0; right:0; top:34px; bottom:0}
        .cap-img img{width:100%; height:100%; object-fit:cover; object-position:top; display:block}
        .cap-spot{position:absolute; inset:0; pointer-events:none}
        .cap-dot{position:absolute; width:52px; height:52px; margin:-26px 0 0 -26px; border-radius:50%; background:var(--accent); color:var(--bg); display:grid; place-items:center; font:800 26px var(--font-body); box-shadow:0 6px 20px rgba(0,0,0,.5)}
        .cap-dot b{position:absolute; inset:-4px; border-radius:50%; border:3px solid var(--accent)}
        .cap-list{position:absolute; left:1350px; right:120px; top:300px; list-style:none; margin:0; padding:0; display:grid; gap:30px}
        .cap-list li{display:grid; grid-template-columns:52px 1fr; gap:18px; align-items:start; font-size:29px; line-height:1.35; color:var(--lead)}
        .cap-list li span:first-child{width:44px; height:44px; border-radius:50%; background:var(--accent); color:var(--bg); display:grid; place-items:center; font:800 22px var(--font-body); margin-top:-2px}`,
      render: (d) => {
        const M = lines(d.marcas).map((l) => { const [x, y, ...t] = l.split('|').map((s) => s.trim()); return { x: +x || 0, y: +y || 0, t: t.join(' | ') }; });
        const uno = modo(d, 'uno') === 'uno', n = M.length;
        // Paso 0: la pantalla; cada paso siguiente, una marca (y la luz se mueve a ella)
        const at = (i) => (uno ? `data-s="${i + 1}" data-at=".1"` : `data-at="${(1.2 + i * 0.5).toFixed(2)}"`);
        const sale = (i) => (uno && i < n - 1 ? `data-out="${i + 2}"` : '');
        return `
        <div class="pad">${kicker(d)}${titulo(d, 0.12, 'md wide')}</div>
        <div class="cap-frame" data-f="imagen" data-k="hero" data-shape="box" data-m="up" data-at=".35" data-dur="1">
          <div class="cap-bar"><i></i><i></i><i></i><span>${esc(d.url || '')}</span></div>
          <div class="cap-img"><img src="${esc(d.imagen)}" alt="">
            ${M.map((m, i) => `<div class="cap-spot" data-m="fade" data-dur=".5" ${at(i)} ${sale(i)} style="background:radial-gradient(circle at ${m.x}% ${m.y}%, transparent 0 70px, rgba(0,0,0,.6) 170px)"></div>`).join('')}
            ${M.map((m, i) => `<div class="cap-dot" data-f="marcas" style="left:${m.x}%; top:${m.y}%" data-m="pop" ${at(i)}><b></b>${i + 1}</div>`).join('')}
          </div>
        </div>
        <ol class="cap-list">${M.map((m, i) => `<li data-f="marcas" data-k="item-${i}" data-shape="bar" data-m="left" ${at(i)} ${uno ? 'data-dim' : ''}><span>${i + 1}</span><span>${md(m.t)}</span></li>`).join('')}</ol>`;
      },
      // Un anillo que late alrededor de cada marca
      tick(root, t) {
        root.querySelectorAll('.cap-dot b').forEach((b, i) => {
          const k = (t * 0.9 + i * 0.27) % 1;
          b.style.transform = `scale(${1 + 0.7 * k})`; b.style.opacity = 1 - k;
        });
      },
    },

    // La cámara entra a la captura: cada avance se acerca a una zona y la nombra ahí mismo
    // (para pantallas donde importa dónde está cada cosa, no una lista al costado)
    recorrido: {
      nombre: 'Recorrido por una pantalla', pasos: 'uno',
      campos: [['kicker', 'text', 'Antetítulo'], ['titulo', 'area', 'Título'], ['imagen', 'image', 'Captura (16:9)'],
        ['zonas', 'lines', 'Zonas: "x | y | texto" por línea (x e y en % de la captura)'], ['zoom', 'number', 'Acercamiento (1.4 a 2.2)']],
      ejemplo: { kicker: 'Pantalla', titulo: 'Recorrela.', zonas: '20 | 30 | Acá\n70 | 60 | Y acá', zoom: 1.7 },
      css: `
        .rc-frame{position:absolute; left:310px; top:280px; width:1300px; height:765px; border-radius:16px; overflow:hidden; background:var(--panel); border:1px solid var(--line); box-shadow:0 30px 80px rgba(0,0,0,.45)}
        .rc-bar{height:34px; display:flex; align-items:center; gap:8px; padding:0 16px; background:var(--panel-2); border-bottom:1px solid var(--line)}
        .rc-bar i{width:11px; height:11px; border-radius:50%; background:var(--line)}
        .rc-frame img{display:block; width:1300px; height:731px; object-fit:cover; object-position:top}
        .rc-ring{position:absolute; width:70px; height:70px; margin:-35px 0 0 -35px; border-radius:50%; border:5px solid var(--accent)}
        .rc-tag{position:absolute; max-width:330px; padding:10px 16px; background:var(--accent); color:var(--bg); font:700 21px/1.3 var(--font-body)}`,
      geo(d) {
        const z = Math.min(2.4, Math.max(1.2, +d.zoom || 1.7)), F = { x: 310, y: 314, w: 1300, h: 731 };
        const Z = lines(d.zonas).map((l) => { const [x, y, ...t] = l.split('|').map((s) => s.trim()); return { X: F.x + ((+x || 0) / 100) * F.w, Y: F.y + ((+y || 0) / 100) * F.h, t: t.join(' | ') }; });
        return { z, F, Z };
      },
      focos(d) {
        const { z, F, Z } = window.TIPOS_PROYECTO.recorrido.geo(d), hw = 960 / z, hh = 540 / z;
        const c = (v, a, b) => Math.min(Math.max(v, a), b);
        return [{ x: 960, y: 540, s: 1 }, ...Z.map((m) => ({ x: c(m.X, F.x + hw - 120, F.x + F.w - hw + 120), y: c(m.Y, F.y + hh - 120, F.y + F.h - hh + 60), s: z }))];
      },
      render(d) {
        const { Z } = window.TIPOS_PROYECTO.recorrido.geo(d), n = Z.length;
        return `
        <div class="pad">${kicker(d)}${titulo(d, 0.12, 'md wide')}</div>
        <div class="rc-frame" data-f="imagen" data-k="hero" data-shape="box" data-m="zoom" data-at=".3" data-dur="1"><div class="rc-bar"><i></i><i></i><i></i></div><img src="${esc(d.imagen)}" alt=""></div>
        ${Z.map((m, i) => {
          const izq = m.X > 1250, out = i < n - 1 ? `data-out="${i + 2}"` : '';
          return `<div class="rc-ring" style="left:${m.X}px; top:${m.Y}px" data-m="pop" data-s="${i + 1}" data-at=".9" data-e="latir" ${out}></div>
          <div class="rc-tag" data-f="zonas" style="${izq ? `right:${1920 - m.X + 50}px` : `left:${m.X + 50}px`}; ${m.Y > 820 ? `bottom:${1080 - m.Y + 30}px` : `top:${m.Y + 30}px`}" data-m="${izq ? 'right' : 'left'}" data-s="${i + 1}" data-at="1" ${out}>${md(m.t)}</div>`;
        }).join('')}`;
      },
    },

    hitos: {
      nombre: 'Línea de tiempo (hitos)', pasos: 'uno',
      campos: [['kicker', 'text', 'Antetítulo'], ['titulo', 'area', 'Título'], ['hitos', 'pairs', 'Hitos: "fecha | qué pasó" por línea']],
      ejemplo: { kicker: 'Recorrido', titulo: 'Cómo *llegamos*.', hitos: 'Marzo | Idea\nJunio | Prototipo\nOctubre | Muestra' },
      css: `
        .hitos{position:absolute; left:300px; right:300px; top:560px; height:4px; background:var(--line)}
        .hitos .h{position:absolute; top:-14px; width:32px; height:32px; margin-left:-16px; border-radius:50%; background:var(--bg); border:6px solid var(--accent)}
        .hitos .lbl{position:absolute; top:60px; width:300px; margin-left:-150px; text-align:center}
        .hitos .lbl b{display:block; font:italic 800 54px/1 var(--font-display); color:var(--accent)}
        .hitos .lbl span{display:block; margin-top:14px; font-size:30px; line-height:1.35; color:var(--lead)}`,
      render: (d) => {
        const H = pairs(d.hitos), n = H.length, uno = modo(d, 'uno') === 'uno';
        const x = (i) => (n > 1 ? (i / (n - 1)) * 100 : 50);
        return `
        <div class="pad">${kicker(d)}${titulo(d)}</div>
        <div class="hitos"><div data-m="wipe" data-dur="1.6" data-at=".4" style="position:absolute; inset:0; background:var(--accent)"></div>
          ${H.map((h, i) => {
            const a = uno ? `data-s="${i}" data-at="${i ? 0.1 : 0.9}"` : `data-at="${(0.9 + i * 0.25).toFixed(2)}"`;
            return `<i class="h" style="left:${x(i)}%" data-m="pop" ${a}></i>
            <div class="lbl" data-f="hitos" style="left:${x(i)}%" data-m="up" ${a}><b>${esc(h.t)}</b><span>${md(h.d)}</span></div>`;
          }).join('')}
        </div>`;
      },
    },
  };
})();
