import { from, interval, Observable, of } from 'rxjs';

export function createObservableWithOneValue<T>(values: T): Observable<T> {
  return of(values);
}

export function createObservablesWithMultipleValues(
  ...args: any[]
): Observable<any> {
  return from(args);
}

export function createObservableEmitsValueEveryMS(): Observable<number> {
  return interval(1);
}

export function createObservableFromPromise(
  promise: Promise<any>
): Observable<any> {
  return from(promise);
}
