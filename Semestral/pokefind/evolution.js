/* evolution.js - obtiene y renderiza la cadena evolutiva completa */

window.Evolution = (() => {

    const speciesAPI = "https://pokeapi.co/api/v2/pokemon-species/";
    const evoChainBase = "https://pokeapi.co";

    // Recorrer la estructura de chain recursivamente y construir una lista de nodos
    function traverseChain(chain, list = [], fromCondition = null) {
        // chain.species.name
        list.push({
            name: chain.species.name,
            fromCondition: fromCondition // detalles de cómo llegó aquí desde su padre
        });

        if (chain.evolves_to && chain.evolves_to.length > 0) {
            for (const evo of chain.evolves_to) {
                // evolution_details es un array - tomamos el primer objeto para simplificar
                const detail = evo.evolution_details && evo.evolution_details.length ? evo.evolution_details[0] : null;
                let condition = null;
                if (detail) {
                    // obtener condición principal (nivel, item, trigger)
                    if (detail.min_level) condition = `Nivel ${detail.min_level}`;
                    else if (detail.trigger && detail.trigger.name) condition = detail.trigger.name;
                    else if (detail.item && detail.item.name) condition = `Item: ${detail.item.name}`;
                    else condition = JSON.stringify(detail);
                }
                traverseChain(evo, list, condition);
            }
        }
        return list;
    }

    async function renderEvolutionFromPokemon(pokemonName, containerElement) {
        try {
            containerElement.innerHTML = `<div class="brut-card">Cargando cadena evolutiva...</div>`;

            // 1) Obtener species para obtener evolution_chain.url
            const spRes = await fetch(speciesAPI + pokemonName.toLowerCase());
            if (!spRes.ok) throw new Error("Species no encontrada");
            const speciesData = await spRes.json();

            const evoChainUrl = speciesData.evolution_chain.url; // e.g. https://pokeapi.co/api/v2/evolution-chain/10/
            const chainRes = await fetch(evoChainUrl);
            const chainData = await chainRes.json();

            const list = traverseChain(chainData.chain, [], null); // lista de {name, fromCondition}

            // Obtener sprites para cada stage
            const withSprites = [];
            for (const node of list) {
                try {
                    const pRes = await fetch("https://pokeapi.co/api/v2/pokemon/" + node.name);
                    const pData = await pRes.json();
                    withSprites.push({
                        name: node.name,
                        sprite: pData.sprites.front_default,
                        condition: node.fromCondition
                    });
                } catch (e) {
                    withSprites.push({
                        name: node.name,
                        sprite: null,
                        condition: node.fromCondition
                    });
                }
            }

            // Render
            const html = withSprites.map((n, i) => `
                <div style="display:inline-block; text-align:center; margin-right:16px;">
                    <div class="brut-card" style="padding:10px; width:140px; cursor:pointer;" onclick="document.querySelector('#searchInput').value='${n.name}'; document.querySelector('#btnBuscar').click();">
                        <img src="${n.sprite || ''}" alt="${n.name}" style="width:80px; height:80px; display:block; margin:0 auto;">
                        <div style="text-transform:uppercase; margin-top:6px;">${n.name}</div>
                        <div style="font-size:12px; margin-top:4px;">${n.condition ? n.condition : ''}</div>
                    </div>
                </div>
                ${ (i < withSprites.length-1) ? `<div style="display:inline-block; vertical-align:middle; margin-right:8px;">➡️</div>` : '' }
            `).join("");

            containerElement.innerHTML = `<div class="brut-card"><h3>Cadena evolutiva</h3><div style="display:flex; align-items:center;">${html}</div></div>`;

        } catch (e) {
            containerElement.innerHTML = `<div class="brut-card" style="border-color:var(--color-error);">No se pudo cargar la cadena evolutiva</div>`;
        }
    }

    return { renderEvolutionFromPokemon };

})();
