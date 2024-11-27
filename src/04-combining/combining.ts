import {
  combineLatest,
  forkJoin,
  map,
  merge,
  mergeMap,
  Observable,
  race,
  switchMap,
  withLatestFrom,
  zip,
} from 'rxjs';
import { Cart, CartProduct, Pokemon } from '../types';

export function mergeObservable<T, U>(
  obs1$: Observable<T>,
  obs2$: Observable<U>
): Observable<T | U> {
  return merge(obs1$, obs2$);
}

export function joinObservable<T, U>(
  observables$: [Observable<T>, Observable<U>]
): Observable<[T, U]> {
  return forkJoin(observables$);
}

export function joinInPairs<T, U>(
  obs1$: Observable<T>,
  obs2$: Observable<U>
): Observable<[T, U]> {
  return zip(obs1$, obs2$);
}

export function combineObservables<T, U>(
  observables$: [Observable<T>, Observable<U>]
): Observable<[T, U]> {
  return combineLatest(observables$);
}

export function getFaster<T, U>(
  observables$: [Observable<T>, Observable<U>]
): Observable<T | U> {
  return race(observables$);
}

export function addProductToCard(
  addProduct$: Observable<CartProduct>,
  cart$: Observable<Cart>
): Observable<Cart> {
  return addProduct$.pipe(
    withLatestFrom(cart$),
    map(([addProduct, cart]) => {
      const cartProduct = cart.find(
        (product) => product.name === addProduct?.name
      );
      if (cartProduct) {
        cartProduct.quantity += addProduct.quantity;
      } else {
        cart.push(addProduct);
      }

      return cart;
    })
  );
}

export function getAllPokemon(
  obs$: Observable<number>,
  // eslint-disable-next-line no-unused-vars
  getPokemonById: (id: number) => Observable<Pokemon>
) {
  return obs$.pipe(mergeMap(getPokemonById));
}

export function getLastPokemonAndCancelSearch(
  obs$: Observable<number>,
  // eslint-disable-next-line no-unused-vars
  getPokemonById: (id: number) => Observable<Pokemon>
) {
  return obs$.pipe(switchMap(getPokemonById));
}
