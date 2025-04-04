import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about-page/about-page.component').then(
        (m) => m.AboutPageComponent
      ),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact-page/contact-page.component').then(
        (m) => m.ContactPageComponent
      ),
  },
  {
    path: 'pricing',
    loadComponent: () =>
      import('./pages/pricing-page/pricing-page.component').then(
        (m) => m.PricingPageComponent
      ),
  },
  {
    path: 'pokemons/page/:page',
    loadComponent: () =>
      import('./pages/pokemons-page/pokemons-page.component').then(
        (m) => m.PokemonsPageComponent
      ),
  },
  {
    path: 'pokemons/:id',
    loadComponent: () =>
      import('./pages/pokemon-page/pokemon-page.component').then(
        (m) => m.PokemonPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'pokemons/page/1',
  },
];
