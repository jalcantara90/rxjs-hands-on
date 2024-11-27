import { Observable } from 'rxjs';
import { Product } from '../types';

export function filterAnyTimeFare(
  obs$: Observable<Product>
): Observable<Product> {
  return obs$.pipe();
}

export function getFirstValue(obs$: Observable<Product>): Observable<Product> {
  return obs$.pipe();
}

export function getLastValue(obs$: Observable<Product>): Observable<Product> {
  return obs$.pipe();
}

export function getThreeFirstValue(obs$: Observable<Product>): Observable<Product> {
  return obs$.pipe();
}
