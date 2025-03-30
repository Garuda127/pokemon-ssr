import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, type Observable } from "rxjs";
import type { SimplePokemon } from "../interfaces/simple-pokemon.interface";
import type { PokeAPIResponse } from "../interfaces/pokemon-api.response";
import type { Pokemon } from "../interfaces/pokemon.interface";

@Injectable({
	providedIn: "root",
})
export class PokemonsService {
	private http = inject(HttpClient);

	public loadPage(page: number): Observable<SimplePokemon[]> {
		let pageIndex = page !== 0 ? page - 1 : 0;
		pageIndex = Math.max(0, pageIndex);

		return this.http
			.get<PokeAPIResponse>(
				`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${pageIndex * 20}`,
			)
			.pipe(
				map((res) => {
					const simplePokemons: SimplePokemon[] = res.results.map(
						(pokemon) => ({
							id: pokemon.url.split("/").at(-2) ?? "",
							name: pokemon.name,
						}),
					);
					return simplePokemons;
				}),
			);
	}

	public loadPokemon(id: string) {
		return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`);
	}
}
