import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	input,
} from "@angular/core";
import type { SimplePokemon } from "../../interfaces/simple-pokemon.interface";

@Component({
	selector: "pokemon-card",
	imports: [],
	templateUrl: "./pokemon-card.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonCardComponent {
	public pokemon = input.required<SimplePokemon>();
	public pokemonImg = computed(() => {
		return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.pokemon().id}.png`;
	});
}
