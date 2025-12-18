/* app.js - búsqueda, UI y animaciones */

const App = (() => {
  const API = "https://pokeapi.co/api/v2/pokemon/";
  const input = document.getElementById("searchInput");
  const btnBuscar = document.getElementById("btnBuscar");
  const resultado = document.getElementById("resultado");
  const evoContainer = document.getElementById("evoContainer");
  const pokeballBg = document.getElementById("pokeballBg");
  const autocompleteBox = document.getElementById("autocomplete");
  const soundToggle = document.getElementById("soundToggle");

  // simple click sound (optional) - not shipping binary sound, use beep via WebAudio
  function playClick(){
    if (!soundToggle || !soundToggle.checked) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value=880;
      o.connect(g); g.connect(ctx.destination);
      g.gain.value = 0.02;
      o.start(); o.stop(ctx.currentTime + 0.04);
    } catch(e){}
  }

  async function buscarPokemon(nombre){
    playClick();
    if (!nombre) return;
    Storage.addHistory(nombre);
    // Abrir pokeball (CSS animation via class)
    pokeballBg.classList.add("opening");

    const cache = Storage.load("poke_" + nombre.toLowerCase());
    if (cache && !cache.expired){
      renderPokemon(cache.data, "CACHE");
      return;
    }

    try{
      showLoading();
      const res = await fetch(API + nombre.toLowerCase());
      if (!res.ok) throw new Error("No encontrado");
      const data = await res.json();
      Storage.save("poke_" + nombre.toLowerCase(), data);
      renderPokemon(data, "API");
    } catch(e){
      renderError("Pokémon no encontrado");
    }
  }

  function showLoading(){
    resultado.innerHTML = `<div class="pokemon-card-comic"><div>Cargando...</div></div>`;
    evoContainer.innerHTML = "";
    // hide center circle while showing the result/loading
    if (pokeballBg) pokeballBg.classList.add('hide-center');
  }
  function renderError(msg){
    resultado.innerHTML = `<div class="pokemon-card-comic" style="border-color:var(--accent-2)">${msg}</div>`;
    evoContainer.innerHTML = "";
    if (pokeballBg) pokeballBg.classList.add('hide-center');
  }

  function renderPokemon(poke, origen){
    evoContainer.innerHTML = ""; // limpiar evoluciones
    const tipos = poke.types.map(t=>t.type.name).join(", ");

    // stats mapping
    const statMap = {};
    poke.stats.forEach(s => statMap[s.stat.name] = s.base_stat);

    const html = `
      <div class="pokemon-card-comic">
        <div style="width:180px; text-align:center;">
          <img id="spriteImg" src="${poke.sprites.front_default}" width="140" class="sprite-pop" />
        </div>
        <div style="flex:1;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="font-weight:bold; font-size:20px;">#${poke.id} - ${poke.name.toUpperCase()}</div>
            <div style="background:var(--yellow); padding:6px 10px; border:6px solid var(--black);">Tipos: ${tipos}</div>
            <div style="padding:6px 10px; border:6px solid var(--black); background:#fff;">${origen}</div>
          </div>

          <div style="margin-top:12px;">
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <button id="favToggle" class="small-button">${ Storage.getFavorites().includes(poke.id) ? "Quitar ❤️" : "Agregar ❤️" }</button>
              <button id="verEvo" class="small-button">Ver Evolución</button>
            </div>
          </div>

                <div style="margin-top:12px;">
                  <strong>Estadísticas:</strong>
                  <div class="stats">
                    ${["hp","attack","defense","special-attack","special-defense","speed"].map(s => {
                      const val = statMap[s] || 0;
                      const pct = Math.min(100, Math.round((val / 150) * 100));
                      const label = s === 'special-attack' ? 'Sp.Atk' : (s === 'special-defense' ? 'Sp.Def' : s.charAt(0).toUpperCase() + s.slice(1));
                      return `
                        <div class="stat-row">
                          <div class="stat-label">${label}:</div>
                          <div class="stat-bar"><div class="stat-fill" style="width:${pct}%"></div></div>
                          <div class="stat-value">${val}</div>
                        </div>`;
                    }).join('')}
                  </div>
                </div>
        </div>
      </div>
    `;
    resultado.innerHTML = html;
    // Ensure the existing evoContainer element (kept in the module variable)
    // is appended into `resultado`. Use the preserved `evoContainer` reference
    // instead of querying the DOM (innerHTML replacement may detach the node).
    try{
      if (evoContainer && resultado && evoContainer.parentElement !== resultado) {
        resultado.appendChild(evoContainer);
      }
    }catch(e){}
    // make sure center circle is hidden while result is visible
    if (pokeballBg) pokeballBg.classList.add('hide-center');

    // sprite animation reflow
    const spr = document.getElementById("spriteImg");
    if (spr){
      spr.classList.remove("sprite-pop");
      void spr.offsetWidth;
      spr.classList.add("sprite-pop");
    }

    // favoritos
    document.getElementById("favToggle").addEventListener("click", ()=>{
      if (Storage.getFavorites().includes(poke.id)){
        Storage.removeFavorite(poke.id);
        document.getElementById("favToggle").textContent = "Agregar ❤️";
      } else {
        Storage.addFavorite(poke.id);
        document.getElementById("favToggle").textContent = "Quitar ❤️";
      }
    });

    // ver evolución
    document.getElementById("verEvo").addEventListener("click", async ()=>{
      if (window.Evolution && typeof window.Evolution.renderEvolutionFromPokemon === "function"){
        await window.Evolution.renderEvolutionFromPokemon(poke.name, evoContainer);
      } else {
        evoContainer.innerHTML = `<div class="pokemon-card-comic">Módulo de evolución no disponible</div>`;
      }
    });

    // Close pokeball state after showing
    setTimeout(()=> pokeballBg.classList.remove("opening"), 700);
  }

  /* Autocomplete */
  let listaNombres = [];
  async function cargarLista(){
    const cache = Storage.load("listaPokemons");
    if (cache && !cache.expired){ listaNombres = cache.data; return; }
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
    const data = await res.json();
    listaNombres = data.results.map(x=>x.name);
    Storage.save("listaPokemons", listaNombres);
  }
  cargarLista();

  input.addEventListener("input", (e)=>{
    const txt = e.target.value.toLowerCase().trim();
    if (!txt){ autocompleteBox.style.display="none"; return; }
    const filtrados = listaNombres.filter(n=>n.startsWith(txt)).slice(0,8);
    if (!filtrados.length){ autocompleteBox.style.display="none"; return; }
    autocompleteBox.innerHTML = filtrados.map(n => `<div class="ac-item">${n}</div>`).join("");
    autocompleteBox.style.display="block";
    document.querySelectorAll('.ac-item').forEach(d => {
      d.addEventListener('click', ()=>{
        input.value = d.textContent;
        autocompleteBox.style.display="none";
      });
    });
  });

  // Event listeners
  btnBuscar.addEventListener("click", ()=>{
    const modo = document.getElementById("modoBusqueda").value;
    const q = input.value.trim();
    if (!q) return;
    if (modo === "pokemon") buscarPokemon(q);
    else Ability.buscarHabilidad(q);
  });

  // support pressing Enter
  input.addEventListener("keydown", (e)=>{ if (e.key==="Enter") btnBuscar.click(); });

  // If page opened with ?buscar=NAME (from histórico/favoritos), perform search
  try{
    const params = new URLSearchParams(window.location.search);
    const q = params.get('buscar');
    if (q){
      // fill input and trigger search shortly after load
      input.value = decodeURIComponent(q);
      setTimeout(()=> buscarPokemon(q), 120);
    }
  }catch(e){}

  // expose for debug
  return { buscarPokemon };
})();

/* end app.js */
