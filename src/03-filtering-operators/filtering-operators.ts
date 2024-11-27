import { filter, first, last, Observable, take } from 'rxjs';
import { Product } from '../types';

export function filterAnyTimeFare(
  obs$: Observable<Product>
): Observable<Product> {
  return obs$.pipe(filter((product) => product.fare.type === 'Anytime'));
}

export function getFirstValue(obs$: Observable<Product>): Observable<Product> {
  return obs$.pipe(first());
}

export function getLastValue(obs$: Observable<Product>): Observable<Product> {
  return obs$.pipe(last());
}

export function getThreeFirstValue(obs$: Observable<Product>): Observable<Product> {
  return obs$.pipe(take(3));
}
