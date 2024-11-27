import { lastValueFrom, take } from 'rxjs';
import {
  createObservableEmitsValueEveryMS,
  createObservablesWithMultipleValues,
  createObservableWithOneValue,
  createObservableFromPromise,
} from './creator-functions';
import { createTestscheduler } from '../utils/test-utils';
import { TestScheduler } from 'rxjs/testing';

describe('Creator functions', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = createTestscheduler();
  });

  it('should create an observable able to emit a value', () => {
    testScheduler.run(({ expectObservable }) => {
      const value = [1, 2, 3];
      const obs$ = createObservableWithOneValue(value);

      const expected = '(a|)';
      const expectedValues = { a: [1, 2, 3] };

      expectObservable(obs$).toBe(expected, expectedValues);
    });
  });

  it('should create an observable able to emit multiple values', () => {
    testScheduler.run(({ expectObservable }) => {
      const expectedValues = {
        a: 2,
        b: 'A',
        c: '1A',
      };
      const obs$ = createObservablesWithMultipleValues(
        expectedValues.a,
        expectedValues.b,
        expectedValues.c
      );

      const expected = '(abc|)'; // emits all the values and completes without delay

      expectObservable(obs$).toBe(expected, expectedValues);
    });
  });

  it('should create an observable able to emit a numeric value every ms', () => {
    testScheduler.run(({ expectObservable }) => {
      const obs$ = createObservableEmitsValueEveryMS().pipe(
        take(5) // just to ensure the observable will be completed after 5 values.
      );

      const expected = '-abcd(e|)';
      const expectedValues = { a: 0, b: 1, c: 2, d: 3, e: 4 };

      expectObservable(obs$).toBe(expected, expectedValues);
    });
  });

  it('should resolve the promise and return the value', async () => {
    const value = 'resolved';
    const promise = new Promise((resolve) => {
      return resolve(value);
    });

    const obs$ = createObservableFromPromise(promise);

    const result = await lastValueFrom(obs$);

    expect(result).toBe(value);
  });
});
