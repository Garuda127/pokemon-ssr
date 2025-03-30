import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  type OnInit,
  signal,
} from '@angular/core';
import { PokemonListComponent } from '../../pokemons/components/pokemon-list/pokemon-list.component';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import type { SimplePokemon } from '../../pokemons/interfaces/simple-pokemon.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { PokemonListSkeletonComponent } from './ui/pokemon-list-skeleton/pokemon-list-skeleton.component';

@Component({
  selector: 'app-pokemons-page',
  imports: [PokemonListComponent, PokemonListSkeletonComponent],
  templateUrl: './pokemons-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonsPageComponent implements OnInit {
  // private appRef = inject(ApplicationRef);
  // Sirve para detectar cuando el componente se ha renderizado
  // private $appState = this.appRef.isStable.subscribe((isStable) => {
  //   console.log({ isStable });
  // });
  // Si se subscribe a nivel de componente, se debe desuscribir
  // ngOnDestroy(): void {
  //   this.$appState.unsubscribe();
  // }
  private pokemonsService = inject(PokemonsService);
  public isLoading = signal(true);
  public pokemons = signal<SimplePokemon[]>([]);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private title = inject(Title);
  private meta = inject(Meta);
  public currentPage = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => params.get('page') ?? '1'),
      map((page) => (Number.isNaN(+page) ? 1 : +page)),
      map((page) => Math.max(1, page))
    )
  );

  ngOnInit(): void {
    // this.route.queryParamMap.subscribe(console.log);
    this.isLoading.set(false);
    this.loadPokemons();
    this.meta.updateTag({
      name: 'keywords',
      content:
        'pokemons, pokemon, pokemon list, pokemon page, Garuda, Garuda proyects',
    });
  }

  public loadPokemons(nextPage = 0) {
    const pageToLoad = (this.currentPage() ?? 1) + nextPage;
    this.pokemonsService
      .loadPage(pageToLoad)
      .pipe(
        tap(() =>
          this.router.navigate([], { queryParams: { page: pageToLoad } })
        ),
        tap(() =>
          this.title.setTitle(
            `Pokémons SSR - Page ${pageToLoad === 0 ? 1 : pageToLoad}`
          )
        )
      )
      .subscribe(this.pokemons.set);
  }
}
