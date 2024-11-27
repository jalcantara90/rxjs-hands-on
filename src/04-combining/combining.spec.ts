import { createTestscheduler } from '../utils/test-utils';
import {
  addProductToCard,
  combineObservables,
  getAllPokemon,
  getFaster,
  getLastPokemonAndCancelSearch,
  joinInPairs,
  joinObservable,
  mergeObservable,
} from './combining';
import { TestScheduler } from 'rxjs/testing';
import { getPokemonById, pokedex } from '../fixtures/pokemon';

const numbersValues = { a: 1, b: 2 };
const lettersValues = { c: 'A', d: 'B' };

describe('Combining', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = createTestscheduler();
  });

  it('should join two observables in one observable source', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const values = { ...numbersValues, ...lettersValues };

      const numbers$ = cold('-a--b|', numbersValues);
      const letters$ = cold('c-d--|', lettersValues);
      const obs$ = mergeObservable(numbers$, letters$);

      const expected = 'cad-b|';

      expectObservable(obs$).toBe(expected, values);
    });
  });

  it('should wait until all observables complete and send the last value of each one', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const values = { a: [2, 'B'] };

      const numbers$ = cold('-a--b|', numbersValues);
      const letters$ = cold('c-d--|', lettersValues);
      const obs$ = joinObservable([numbers$, letters$]);

      const expected = '-----(a|)';

      expectObservable(obs$).toBe(expected, values);
    });
  });

  it('should emit pair of values with latest values of each observable', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const numbers$ = cold('-a--b', numbersValues);
      const letters$ = cold('-------c-d', lettersValues);
      const obs$ = joinInPairs(numbers$, letters$);

      const expected = '-------a-b';
      const expectedValues = { a: [1, 'A'], b: [2, 'B'] };
      expectObservable(obs$).toBe(expected, expectedValues);
    });
  });

  it('should combine last values of two observables and send it together', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const numbers$ = cold('-a--b|', numbersValues);
      const letters$ = cold('----c---d|', lettersValues);
      const obs$ = combineObservables([numbers$, letters$]);

      const expected = '----a---b|';
      const expectedValues = { a: [2, 'A'], b: [2, 'B'] };
      expectObservable(obs$).toBe(expected, expectedValues);
    });
  });

  it('should emit the first value emitted for the faster observable', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const numbers$ = cold('-a--b|', numbersValues);
      const letters$ = cold('----c---d|', lettersValues);
      const obs$ = getFaster([numbers$, letters$]);

      const expected = '-a--b|';
      const expectedValues = { a: 1, b: 2 };
      expectObservable(obs$).toBe(expected, expectedValues);
    });
  });

  it('should add the products into cart', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const cartValues = {
        a: [
          {
            name: 'Apples',
            quantity: 1,
          },
        ],
        b: [
          {
            name: 'Apples',
            quantity: 3,
          },
        ],
      };

      const productsValues = {
        c: {
          name: 'Apples',
          quantity: 2,
        },
        d: {
          name: 'Tomatoes',
          quantity: 5,
        },
      };

      const cart$ = cold('-a--b', cartValues);
      const addProduct$ = cold('--c---d', productsValues);
      const obs$ = addProductToCard(addProduct$, cart$);

      const expected = '--a---b';
      const expectedValues = {
        a: [{ name: 'Apples', quantity: 3 }],
        b: [
          { name: 'Apples', quantity: 3 },
          {
            name: 'Tomatoes',
            quantity: 5,
          },
        ],
      };
      expectObservable(obs$).toBe(expected, expectedValues);
    });
  });

  it('should emit a pokemon for every id', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const pokeSearch$ = cold('-a--bc-d|', { a: 1, b: 2, c: 3, d: 4 });

      const obs$ = getAllPokemon(
        pokeSearch$,
        getPokemonById
      );

      const expected = '--a--bc-(d|)';
      const expectedValues = {
        a: pokedex[0],
        b: pokedex[1],
        c: pokedex[2],
        d: pokedex[3],
      };

      expectObservable(obs$).toBe(expected, expectedValues);
    });
  });

  it('should emit first pokemon found and cancel the search', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const pokeSearch$ = cold('-abcd|', { a: 1, b: 2, c: 3, d: 4 });

      const obs$ = getLastPokemonAndCancelSearch(
        pokeSearch$,
        getPokemonById
      );

      const expected = '-----(a|)';
      const expectedValues = {
        a: pokedex[3],
      };

      expectObservable(obs$).toBe(expected, expectedValues);
    });
  });
});
