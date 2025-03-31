import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  type OnInit,
  signal,
} from '@angular/core';
import { PokemonListComponent } from '../../pokemons/components/pokemon-list/pokemon-list.component';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import type { SimplePokemon } from '../../pokemons/interfaces/simple-pokemon.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { PokemonListSkeletonComponent } from './ui/pokemon-list-skeleton/pokemon-list-skeleton.component';

@Component({
  selector: 'app-pokemons-page',
  imports: [PokemonListComponent, PokemonListSkeletonComponent, RouterLink],
  templateUrl: './pokemons-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonsPageComponent {
  private pokemonsService = inject(PokemonsService);
  public isLoading = signal(true);
  public pokemons = signal<SimplePokemon[]>([]);

  private route = inject(ActivatedRoute);

  private title = inject(Title);
  private meta = inject(Meta);
  public currentPage = toSignal(
    this.route.params.pipe(
      map((params) => params['page'] ?? '1'),
      map((page) => (Number.isNaN(+page) ? 1 : +page)),
      map((page) => Math.max(1, page))
    )
  );

  public loadOnPageChange = effect(() => {
    this.loadPokemons(this.currentPage());
  });

  public loadPokemons(nextPage = 0) {
    const pageToLoad = nextPage;
    this.pokemonsService
      .loadPage(pageToLoad)
      .pipe(
        tap(() =>
          this.title.setTitle(
            `Pokémons SSR - Page ${pageToLoad === 0 ? 1 : pageToLoad}`
          )
        )
      )
      .subscribe(this.pokemons.set);
  }
}
