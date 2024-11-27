import { lastValueFrom } from 'rxjs';
import { createObservablesWithMultipleValues } from '../01-creator-functions/creator-functions';
import { fares } from '../fixtures/fares';
import { discountPercentage } from '../utils/discount-percentage';
import { createTestscheduler } from '../utils/test-utils';
import {
  executeSideEffectForEveryValue,
  groupByFare,
  transformObservableValuesApplying10Discount,
  transformObservableValuesIntoArray,
  accumulateSendAllTheValues,
  accumulateSendTheJustFinalValue,
} from './transform-operators';
import { Product } from '../types';
import {
  birminghamToGlasgow,
  birminghamToLondon,
  glasGowToBirmingham,
  londonToBirmingham,
  londonToManchester,
  manchesterToLondon,
  products,
} from '../fixtures/products';
import { TestScheduler } from 'rxjs/testing';

describe('Transform operator', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = createTestscheduler();
  });

  it('should update the fare price applying the 10% of discount', () => {
    const expectedValues = {
      a: {
        ...fares[0],
        amount: discountPercentage(fares[0].amount, 10),
      },
      b: {
        ...fares[1],
        amount: discountPercentage(fares[1].amount, 10),
      },
      c: {
        ...fares[2],
        amount: discountPercentage(fares[2].amount, 10),
      },
    };

    testScheduler.run(({ expectObservable, cold }) => {
      const fares$ = cold('-a--bc|', { a: fares[0], b: fares[1], c: fares[2] });
      const obs$ = transformObservableValuesApplying10Discount(fares$);
      const expected = '-a--bc|';

      expectObservable(obs$).toBe(expected, expectedValues);
    });
  });

  it('should execute side effect for every value emitted', async () => {
    const sideEffect = jest.fn();
    const obs$ = executeSideEffectForEveryValue(
      createObservablesWithMultipleValues(...fares),
      sideEffect
    );

    await lastValueFrom(obs$);
    expect(sideEffect).toHaveBeenCalledTimes(fares.length);
  });

  it('should get all the values from observable and return an array with all of them', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const fares$ = cold('-a--bc|', { a: fares[0], b: fares[1], c: fares[2] });
      const obs$ = transformObservableValuesIntoArray(fares$);

      const expected = '------(a|)';
      expectObservable(obs$).toBe(expected, { a: fares });
    });
  });

  it('should group all the products by fare type and emit a value per group', () => {
    testScheduler.run(({ expectObservable }) => {
      const values: Record<string, Product[]> = {
        a: [londonToManchester, birminghamToLondon, glasGowToBirmingham],
        b: [manchesterToLondon, londonToBirmingham],
        c: [birminghamToGlasgow],
      };
      const obs$ = groupByFare(
        createObservablesWithMultipleValues(...products),
        (product: Product) => product.fare.type
      );

      const expected = '(abc|)';

      expectObservable(obs$).toBe(expected, values);
    });
  });

  it('should accumulate all the values and emit one value for each of them', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const numbers = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
      }
      const numbers$ = cold('-a--bc-d-e|', numbers);
      const obs$ = accumulateSendAllTheValues(numbers$);

      
      const expected = '-a--bc-d-e|';
      const expectedValues: Record<string, number> = {
        a: 1,
        b: 3,
        c: 6,
        d: 10,
        e: 15,
      };

      expectObservable(obs$).toBe(expected, expectedValues);
    });
  });

  it('should accumulate all the values and emit just the last value', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const numbers = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
      }
      const numbers$ = cold('-a--bc-d-e|', numbers);
      const obs$ = accumulateSendTheJustFinalValue(numbers$ );
      
      const expected = '----------(a|)';
      const expectedValues: Record<string, number> = {
        a: 15,
      };

      expectObservable(obs$).toBe(expected, expectedValues);
    });
  });
});
