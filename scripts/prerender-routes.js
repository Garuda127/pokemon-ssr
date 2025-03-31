(async () => {
  const fs = require("fs");
  const totalPokemons = 151;
  const totalPages = Math.ceil(totalPokemons / 20);

  const pokemonIds = Array.from({ length: totalPokemons }, (_, i) => i + 1)
    .map((id) => `/pokemons/${id}`)
    .join("\n");

  const pokemonPages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .map((page) => `/pokemons/page/${page}`)
    .join("\n");

  const pokemonListName = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${totalPokemons}`
  )
    .then((res) => res.json())
    .then((res) =>
      res.results.map((pokemon) => {
        return `/pokemons/${pokemon.name}`;
      })
    )
    .then((res) => res.join("\n"));

  const fileContent = [pokemonIds, pokemonPages, pokemonListName].join("\n");
  fs.writeFileSync("routes.txt", fileContent);

  console.log("Prerender routes generated successfully");
})();
