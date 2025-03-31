import {
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnInit,
  signal,
} from '@angular/core';
import type { Pokemon } from '../../pokemons/interfaces/pokemon.interface';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-pokemon-page',
  imports: [NgOptimizedImage],
  templateUrl: './pokemon-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonPageComponent implements OnInit {
  private pokemonService = inject(PokemonsService);
  public pokemon = signal<Pokemon | null>(null);
  private route = inject(ActivatedRoute);
  private title = inject(Title);
  private meta = inject(Meta);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.pokemonService
      .loadPokemon(id)
      .pipe(
        tap(({ name, id }) => {
          this.title.setTitle(name);
          this.meta.updateTag({
            name: 'description',
            content: `Pagina de pokemon ${name}`,
          });

          this.meta.updateTag({
            name: 'og:title',
            content: `Pagina de Pokemon ${name}`,
          });

          this.meta.updateTag({
            name: 'og:description',
            content: `Pagina de pokemon ${name}`,
          });

          this.meta.updateTag({
            name: 'og:image',
            content: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
          });
        })
      )
      .subscribe(this.pokemon.set);
  }
}
