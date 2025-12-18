/* vs.js - Comparador avanzado con barras y cálculo de efectividad */

const VS = (() => {

    async function buscar() {

        const p1 = document.querySelector("#poke1").value.trim();
        const p2 = document.querySelector("#poke2").value.trim();
        if (!p1 || !p2) {
            document.querySelector("#vs").innerHTML = `<div class="brut-card" style="border-color:var(--color-warning);">Introduce ambos Pokémon</div>`;
            return;
        }

        try {
            document.querySelector("#vs").innerHTML = `<div class="brut-card">Cargando comparación...</div>`;

            const [d1, d2] = await Promise.all([
                fetch("https://pokeapi.co/api/v2/pokemon/" + p1).then(r => {
                    if (!r.ok) throw new Error("p1 no");
                    return r.json();
                }),
                fetch("https://pokeapi.co/api/v2/pokemon/" + p2).then(r => {
                    if (!r.ok) throw new Error("p2 no");
                    return r.json();
                })
            ]);

            // Stats totales
            const total1 = d1.stats.reduce((a,b)=>a+b.base_stat,0);
            const total2 = d2.stats.reduce((a,b)=>a+b.base_stat,0);

            // Bars HTML generator
            function statBar(name, value) {
                // Max base stat chosen 255 to normalize (can ajustarse)
                const pct = Math.round((value / 255) * 100);
                return `
                    <div style="margin-bottom:6px;">
                        <div style="font-weight:bold;">${name}: ${value}</div>
                        <div style="background:#eee; border:var(--border-width) solid var(--border-color); width:320px; height:14px;">
                            <div style="height:14px; width:${pct}%; background:var(--color-accent);"></div>
                        </div>
                    </div>
                `;
            }

            // Construir bloques de stats
            const statsOrder = ["hp","attack","defense","special-attack","special-defense","speed"];
            const statsHtml1 = d1.stats.map(s => statBar(s.stat.name, s.base_stat)).join("");
            const statsHtml2 = d2.stats.map(s => statBar(s.stat.name, s.base_stat)).join("");

            // Calcular efectividades (usando endpoints /type/{name})
            async function calcEffectiveness(attackerTypes, defenderTypes) {
                // compute best multiplier among attacker's types
                let best = 0;
                for (const atype of attackerTypes) {
                    try {
                        const t = await fetch("https://pokeapi.co/api/v2/type/" + atype).then(r => r.json());
                        // obtener listas
                        const dbl = t.damage_relations.double_damage_to.map(x => x.name);
                        const half = t.damage_relations.half_damage_to.map(x => x.name);
                        const none = t.damage_relations.no_damage_to.map(x => x.name);

                        // multiplica sobre los tipos del defensor
                        let mul = 1;
                        for (const d of defenderTypes) {
                            if (dbl.includes(d)) mul *= 2;
                            if (half.includes(d)) mul *= 0.5;
                            if (none.includes(d)) mul *= 0;
                        }
                        if (mul > best) best = mul;
                    } catch (e) {
                        // ignorar errores de tipo
                    }
                }
                // si no hay tipos o best=0 -> devuelve 1 por defecto (sin bonus)
                return best === 0 ? 1 : best;
            }

            const atkTypes1 = d1.types.map(t=>t.type.name);
            const atkTypes2 = d2.types.map(t=>t.type.name);
            const defTypes1 = atkTypes1; // para claridad
            const defTypes2 = atkTypes2;

            // Efectividad: mejor multiplicador ataque1 -> defensa2 y viceversa
            const [mult12, mult21] = await Promise.all([
                calcEffectiveness(atkTypes1, atkTypes2),
                calcEffectiveness(atkTypes2, atkTypes1)
            ]);

            // Score combinado: total_stats * promedio de efectividad
            const score1 = total1 * mult12;
            const score2 = total2 * mult21;

            // Determinar ganador
            let winnerText;
            if (score1 === score2) winnerText = "Empate";
            else winnerText = score1 > score2 ? d1.name : d2.name;

            // Render final
            document.querySelector("#vs").innerHTML = `
                <div class="brut-card" style="display:flex; gap:20px;">
                    <div style="flex:1;">
                        <h3>${d1.name} (x${mult12} efectividad)</h3>
                        <img src="${d1.sprites.front_default}" width="120">
                        <div style="margin-top:8px;">
                            <button class="button" onclick="Storage.addFavorite(${d1.id})">Agregar ❤️</button>
                        </div>
                        <div style="margin-top:12px;">
                            ${statsHtml1}
                        </div>
                        <div style="margin-top:8px;"><strong>Total:</strong> ${total1}</div>
                    </div>

                    <div style="width:220px; text-align:center; align-self:center;">
                        <h2>GANADOR:</h2>
                        <h1 style="font-size:28px;">${winnerText}</h1>
                        <div style="margin-top:12px;">
                            <div><strong>${d1.name} score:</strong> ${Math.round(score1)}</div>
                            <div><strong>${d2.name} score:</strong> ${Math.round(score2)}</div>
                        </div>
                    </div>

                    <div style="flex:1;">
                        <h3>${d2.name} (x${mult21} efectividad)</h3>
                        <img src="${d2.sprites.front_default}" width="120">
                        <div style="margin-top:8px;">
                            <button class="button" onclick="Storage.addFavorite(${d2.id})">Agregar ❤️</button>
                        </div>
                        <div style="margin-top:12px;">
                            ${statsHtml2}
                        </div>
                        <div style="margin-top:8px;"><strong>Total:</strong> ${total2}</div>
                    </div>
                </div>
            `;

        } catch (e) {
            document.querySelector("#vs").innerHTML = `<div class="brut-card" style="border-color:var(--color-error);">Error al comparar — revisa los nombres</div>`;
        }
    }

    return { buscar };
})();
