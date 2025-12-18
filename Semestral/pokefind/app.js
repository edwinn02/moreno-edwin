/* app.js - Búsqueda de Pokémon con stats completos y favorito toggle */

const App = (() => {

    const API = "https://pokeapi.co/api/v2/pokemon/";

    async function buscarPokemon(nombre) {
        Storage.addHistory(nombre);

        const cache = Storage.load("poke_" + nombre);
        if (cache && !cache.expired) {
            renderPokemon(cache.data, "CACHE");
            return;
        }

        try {
            renderLoading();

            const res = await fetch(API + nombre.toLowerCase());
            if (!res.ok) throw new Error("No encontrado");

            const data = await res.json();

            Storage.save("poke_" + nombre, data);
            renderPokemon(data, "API");

        } catch (err) {
            renderError("Pokémon no encontrado");
        }
    }

    function renderLoading() {
        document.querySelector("#resultado").innerHTML =
            `<div class="brut-card">Cargando...</div>`;
    }

    function renderError(msg) {
        document.querySelector("#resultado").innerHTML =
            `<div class="brut-card" style="border-color: var(--color-error);">${msg}</div>`;
    }

    function isFavorito(id) {
        const fav = Storage.getFavorites();
        return fav.includes(id);
    }

    function renderPokemon(poke, origen) {

        const tipos = poke.types.map(t => t.type.name).join(", ");

        // Stats mapping: ensure order HP, Attack, Defense, Sp. Attack, Sp. Defense, Speed
        const statMap = {};
        poke.stats.forEach(s => statMap[s.stat.name] = s.base_stat);

        const statsHTML = `
            <div>
                <h3>Estadísticas</h3>
                <div>
                    <div>HP: ${statMap.hp || 0}</div>
                    <div>Attack: ${statMap.attack || 0}</div>
                    <div>Defense: ${statMap.defense || 0}</div>
                    <div>Sp. Attack: ${statMap['special-attack'] || 0}</div>
                    <div>Sp. Defense: ${statMap['special-defense'] || 0}</div>
                    <div>Speed: ${statMap.speed || 0}</div>
                </div>
            </div>
        `;

        const favButtonText = isFavorito(poke.id) ? "Quitar ❤️" : "Agregar ❤️";

        const html = `
            <div class="brut-card pokemon-card">
                
                <div>
                    <span class="badge" 
                        style="background: ${ origen === "API" ? "var(--color-api)" : "var(--color-cache)" }">
                        ${origen}
                    </span>

                    <h2>#${poke.id} - ${poke.name}</h2>

                    <p><strong>Tipos:</strong> ${tipos}</p>

                    <div style="margin-top:8px;">
                        <button class="button" id="favToggle">${favButtonText}</button>
                        <button class="button" id="verEvo">Ver Evolución</button>
                    </div>

                </div>

                <div style="text-align:center;">
                    <img src="${poke.sprites.front_default}" width="150">
                </div>

            </div>

            <div id="stats" class="brut-card">
                ${statsHTML}
            </div>

            <div id="evoContainer"></div>
        `;

        document.querySelector("#resultado").innerHTML = html;

        // Evento favorito
        document.getElementById("favToggle").addEventListener("click", () => {
            if (isFavorito(poke.id)) {
                Storage.removeFavorite(poke.id);
                document.getElementById("favToggle").textContent = "Agregar ❤️";
            } else {
                Storage.addFavorite(poke.id);
                document.getElementById("favToggle").textContent = "Quitar ❤️";
            }
        });

        // Evento ver evolución -> llama a evolution.js
        document.getElementById("verEvo").addEventListener("click", async () => {
            // carga evolución por species -> evolution_chain
            if (window.Evolution && typeof window.Evolution.renderEvolutionFromPokemon === "function") {
                await window.Evolution.renderEvolutionFromPokemon(poke.name, document.getElementById("evoContainer"));
            } else {
                document.getElementById("evoContainer").innerHTML = `<div class="brut-card">Módulo de evolución no disponible</div>`;
            }
        });

    }

    function init() {

        document.querySelector("#btnBuscar").addEventListener("click", () => {

            const modo = document.querySelector("#modoBusqueda").value;
            const nombre = document.querySelector("#searchInput").value.trim();

            if (!nombre) return;

            if (modo === "pokemon") buscarPokemon(nombre);
            else Ability.buscarHabilidad(nombre);
        });

        // Si venimos con ?buscar=... en URL (desde histórico)
        const params = new URLSearchParams(location.search);
        if (params.has("buscar")) {
            const q = params.get("buscar");
            document.querySelector("#searchInput").value = q;
            document.querySelector("#btnBuscar").click();
        }
    }

    return { init, buscarPokemon };

})();

App.init();

/* ===================================================
   🔍 AUTOCOMPLETADO DE POKÉMON
   =================================================== */

let listaNombres = [];
const caja = document.querySelector("#autocomplete");

// Obtener lista de todos los nombres de Pokémon
async function cargarListaPokemons() {
    const cache = Storage.load("listaPokemons");
    if (cache && !cache.expired) {
        listaNombres = cache.data;
        return;
    }

    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
    const data = await res.json();

    listaNombres = data.results.map(x => x.name);
    Storage.save("listaPokemons", listaNombres);
}

cargarListaPokemons();

// Evento: escribir para sugerir
document.querySelector("#searchInput").addEventListener("input", (e) => {

    const txt = e.target.value.toLowerCase();
    if (!txt) {
        caja.style.display = "none";
        return;
    }

    const filtrados = listaNombres
        .filter(n => n.startsWith(txt))
        .slice(0, 10);

    if (filtrados.length === 0) {
        caja.style.display = "none";
        return;
    }

    caja.innerHTML = filtrados
        .map(n => `<div onclick="selectSuggestion('${n}')">${n}</div>`)
        .join("");

    caja.style.display = "block";
});

// Cuando se selecciona una sugerencia
window.selectSuggestion = function(nombre) {
    document.querySelector("#searchInput").value = nombre;
    caja.style.display = "none";
};

