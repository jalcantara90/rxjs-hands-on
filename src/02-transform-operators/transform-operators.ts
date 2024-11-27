import {
  groupBy,
  map,
  mergeMap,
  Observable,
  reduce,
  scan,
  tap,
  toArray,
} from 'rxjs';
import { Fare, Product } from '../types';
import { discountPercentage } from '../utils/discount-percentage';

export function transformObservableValuesApplying10Discount(
  obs$: Observable<Fare>
): Observable<Fare> {
  return obs$.pipe(
    map((fare) => ({
      ...fare,
      amount: discountPercentage(fare.amount, 10),
    }))
  );
}

export function transformObservableValuesIntoArray(
  obs$: Observable<Fare>
): Observable<Fare[]> {
  return obs$.pipe(toArray());
}

export function executeSideEffectForEveryValue(
  obs$: Observable<Fare>,
  sideEffect: () => void
): Observable<Fare> {
  return obs$.pipe(tap(sideEffect));
}

export function groupByFare(
  obs$: Observable<Product>,
  groupFn: (product: Product) => Product[keyof typeof product]
) {
  return obs$.pipe(
    groupBy(groupFn),
    mergeMap((group$) => group$.pipe(toArray()))
  );
}

export function accumulateSendAllTheValues(obs$: Observable<number>) {
  return obs$.pipe(
    scan((acc, curr) => {
      return acc + curr;
    }, 0)
  );
}

export function accumulateSendTheJustFinalValue(obs$: Observable<number>) {
  return obs$.pipe(
    reduce((acc, curr) => {
      return acc + curr;
    }, 0)
  );
}
