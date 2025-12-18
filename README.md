# 🎮 PokéFinder – Proyecto Semestral

PokéFinder es una aplicación web que permite **buscar**, **explorar**, **comparar** y **guardar Pokémon** utilizando la API pública **PokeAPI**.  
El proyecto fue desarrollado siguiendo un diseño **Brutalist**, usando únicamente **HTML, CSS y JavaScript Vanilla**, sin frameworks.

Este proyecto cumple con todos los requisitos del documento entregado en clase:
- Consumo de API REST
- Manejo de caché con `localStorage` y TTL
- Histórico persistente
- Sistema de favoritos
- Búsqueda por Pokémon y por habilidad
- Comparador VS Battle
- Patrón de módulos con IIFE
- Diseño Brutalist

---

## 📁 Estructura del Proyecto

/pokefinder
│── index.html (Búsqueda principal)
│── historico.html (Histórico de búsquedas)
│── favoritos.html (Lista de favoritos)
│── vs.html (Comparador VS)
│── shared.css (Estilos compartidos Brutalist)
│── shared.js (Caché, Favoritos, Histórico, TTL)
│── app.js (Búsqueda de Pokémon)
│── ability.js (Búsqueda por habilidad)
│── historico.js (Página del histórico)
│── favoritos.js (Página de favoritos)
│── vs.js (Comparador VS)
└── /assets (Íconos opcionales)


---

## 🎯 **Funcionalidades Principales**

### 🔍 Búsqueda de Pokémon
- Buscar por nombre o número (`/pokemon/{id}`)
- Mostrar:
  - Sprite
  - Nombre y número
  - Tipos
  - Stats (HP, Attack, Defense, etc.)
- Indicador de carga
- Badge de origen (API / Caché)

### 🧠 Caché con localStorage (TTL de 24 horas)
- Verifica si el Pokémon ya está almacenado
- Si el contenido está vencido, vuelve a llamar a la API
- Indica visualmente si el dato proviene de *API* o *Caché*

### 🕒 Histórico de búsquedas
- Guarda cada búsqueda
- Lista los más recientes primero
- Permite:
  - Eliminar un ítem individual
  - Eliminar todo el histórico
  - Buscar al hacer clic en un elemento

### ❤️ Sistema de favoritos
- Agregar / eliminar Pokémon como favoritos
- Persistente con localStorage
- Vista dedicada para visualizar todos los favoritos

### 🌀 Búsqueda por habilidad
- Selector para cambiar el modo de búsqueda (Pokémon / Habilidad)
- Muestra:
  - Nombre de habilidad
  - Descripción
  - Lista de Pokémon con dicha habilidad

### ⚔️ VS Battle (Comparador)
- Comparación de dos Pokémon lado a lado
- Muestra:
  - Total de estadísticas de cada Pokémon
  - Determina ganador basado en stats

---

## 🎨 **Diseño Brutalist**

El proyecto cumple estrictamente con las especificaciones:

- Bordes gruesos de 4px
- Sombras duras (sin blur)
- Tipografía monoespaciada (Courier New)
- Botones con efecto de presión
- Colores vibrantes:
  - Amarillo Pokémon `#ffcc00`
  - Coral `#ff6b6b`
  - Verde agua `#4ecdc4`
  - Beige de fondo `#f5e6d3`
- Sin bordes redondeados

---

## 🌐 **API Utilizada**

[PokeAPI v2](https://pokeapi.co/)

Endpoints principales:
- `/pokemon/{name or id}`
- `/pokemon-species/{id}`
- `/evolution-chain/{id}`
- `/ability/{id}`

---

## 🚀 **Cómo usar el proyecto**

1. Abrir el archivo `index.html` en cualquier navegador.
2. Escribir un Pokémon en la barra de búsqueda.
3. Alternar entre búsqueda por:
   - Pokémon
   - Habilidad
4. Navegar usando la barra superior:
   - Búsqueda
   - Histórico
   - Favoritos
   - VS Battle

---

## 🧪 **Tecnologías Utilizadas**

- HTML5
- CSS3 (Brutalist)
- JavaScript (Vanilla)
- Fetch API
- localStorage

---

## 📸 **Capturas de Pantalla**



