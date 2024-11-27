import { TestScheduler } from 'rxjs/testing';
import { createObservablesWithMultipleValues } from '../01-creator-functions/creator-functions';
import {
  londonToBirmingham,
  manchesterToLondon,
  products,
} from '../fixtures/products';
import { Product } from '../types';
import { createTestscheduler } from '../utils/test-utils';
import {
  filterAnyTimeFare,
  getFirstValue,
  getLastValue,
  getThreeFirstValue,
} from './filtering-operators';

describe('filtering-operators', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = createTestscheduler();
  });

  it('should emit only the products with Anytime fare', () => {
    testScheduler.run(({ expectObservable }) => {
      const values: Record<string, Product> = {
        a: manchesterToLondon,
        b: londonToBirmingham,
      };

      const obs$ = filterAnyTimeFare(
        createObservablesWithMultipleValues(...products)
      );

      const expected = '(ab|)';

      expectObservable(obs$).toBe(expected, values);
    });
  });

  it('should emit the first value and complete it', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const productsValues = {
        a: products[0],
        b: products[1],
        c: products[2],
      };

      const product$ = cold('--a--bc--|', productsValues);
      const obs$ = getFirstValue(product$);

      const expected = '--(a|)';
      const expectedValues: Record<string, Product> = {
        a: products[0],
      };

      expectObservable(obs$).toBe(expected, expectedValues);
    });
  });

  it('should emit the last value and complete it', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const productsValues = {
        a: products[0],
        b: products[1],
        c: products[2],
      };

      const product$ = cold('--a--bc--|', productsValues);

      const obs$ = getLastValue(product$);

      const expected = '---------(a|)';
      const expectedValues: Record<string, Product> = {
        a: products[2],
      };
      expectObservable(obs$).toBe(expected, expectedValues);
    });
  });

  it('should emit just 3 first values', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const productsValues = {
        a: products[0],
        b: products[1],
        c: products[2],
        d: products[3],
        e: products[4],
      };

      const product$ = cold('--a--bc-de-|', productsValues);
      const obs$ = getThreeFirstValue(product$);

      const expected = '--a--b(c|)';
      const expectedValues = {
        a: products[0],
        b: products[1],
        c: products[2],
      };
      expectObservable(obs$).toBe(expected, expectedValues);
    });
  });
});
