import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

export function createTestscheduler() {
  return new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  })
}

export function logObservable<T>(obs$: Observable<T>, done: () => void) {
  obs$.subscribe({
    next: console.log,
    complete: done
  });
}