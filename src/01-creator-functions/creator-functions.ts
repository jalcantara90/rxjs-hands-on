import { Observable } from 'rxjs';

export function createObservableWithOneValue<T>(values: T): Observable<T> {}

export function createObservablesWithMultipleValues(
  ...args: any[]
): Observable<any> {}

export function createObservableEmitsValueEveryMS(): Observable<number> {}

export function createObservableFromPromise(
  promise: Promise<any>
): Observable<any> {}
