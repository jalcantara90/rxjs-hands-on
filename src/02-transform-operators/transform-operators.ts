import { Observable } from 'rxjs';
import { Fare, Product } from '../types';
import { discountPercentage } from '../utils/discount-percentage';

export function transformObservableValuesApplying10Discount(
  obs$: Observable<Fare>
): Observable<Fare> {
  return obs$.pipe();
}

export function transformObservableValuesIntoArray(
  obs$: Observable<Fare>
): Observable<Fare[]> {
  return obs$.pipe();
}

export function executeSideEffectForEveryValue(
  obs$: Observable<Fare>,
  sideEffect: () => void
): Observable<Fare> {
  return obs$.pipe();
}

export function groupByFare(
  obs$: Observable<Product>,
  groupFn: (product: Product) => Product[keyof typeof product]
) {
  return obs$.pipe();
}

export function accumulateSendAllTheValues(obs$: Observable<number>) {
  return obs$.pipe();
}

export function accumulateSendTheJustFinalValue(obs$: Observable<number>) {
  return obs$.pipe();
}
