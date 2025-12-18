const Ability = (() => {

    const API = "https://pokeapi.co/api/v2/ability/";

    async function buscarHabilidad(nombre) {

        document.querySelector("#resultado").innerHTML =
            `<div class="brut-card">Buscando habilidad...</div>`;

        try {
            const res = await fetch(API + nombre.toLowerCase());
            if (!res.ok) throw new Error();

            const data = await res.json();

            const desc = data.effect_entries.find(e => e.language.name === "en");

            let lista = data.pokemon.map(p => 
                `<li><button onclick="AppBuscar('${p.pokemon.name}')">${p.pokemon.name}</button></li>`
            ).join("");

            document.querySelector("#resultado").innerHTML = `
                <div class="brut-card">
                    <h2>${data.name}</h2>
                    <p>${desc.effect}</p>
                    <h3>Pokémon con esta habilidad:</h3>
                    <ul>${lista}</ul>
                </div>
            `;

        } catch (e) {
            document.querySelector("#resultado").innerHTML =
                `<div class="brut-card">Habilidad no encontrada</div>`;
        }
    }

    window.AppBuscar = (n) => {
        document.querySelector("#searchInput").value = n;
        document.querySelector("#btnBuscar").click();
    };

    return { buscarHabilidad };

})();
