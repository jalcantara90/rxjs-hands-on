import { map, Observable } from 'rxjs';
import { Cart, CartProduct, Pokemon } from '../types';

export function mergeObservable<T, U>(
  obs1$: Observable<T>,
  obs2$: Observable<U>
): Observable<T | U> {}

export function joinObservable<T, U>(
  observables$: [Observable<T>, Observable<U>]
): Observable<[T, U]> {}

export function joinInPairs<T, U>(
  obs1$: Observable<T>,
  obs2$: Observable<U>
): Observable<[T, U]> {}

export function combineObservables<T, U>(
  observables$: [Observable<T>, Observable<U>]
): Observable<[T, U]> {}

export function getFaster<T, U>(
  observables$: [Observable<T>, Observable<U>]
): Observable<T | U> {}

export function addProductToCard(
  addProduct$: Observable<CartProduct>,
  cart$: Observable<Cart>
): Observable<Cart> {
  return addProduct$.pipe(
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
  return obs$.pipe();
}

export function getLastPokemonAndCancelSearch(
  obs$: Observable<number>,
  // eslint-disable-next-line no-unused-vars
  getPokemonById: (id: number) => Observable<Pokemon>
) {
  return obs$.pipe();
}
