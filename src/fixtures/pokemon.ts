import { delay, EMPTY, Observable, of } from 'rxjs';
import { Pokemon } from '../types';

export const pokedex: Pokemon[] = [
  {
    id: 1,
    name: 'Bulbasaur',
    description:
      'A strange seed was planted on its back at birth. "The plant sprouts and grows with this POKéMON."',
  },
  {
    id: 2,
    name: 'Ivysaur',
    description:
      'When the bulb on its back grows large, it appears "to lose the ability to stand on its hind legs."',
  },
  {
    id: 3,
    name: 'Venusaur',
    description:
      'The plant blooms when it is absorbing solar "energy. It stays on the move to seek sunlight.',
  },
  {
    id: 4,
    name: 'Charmander',
    description:
      'Obviously prefers hot places. When it rains, steam "is said to spout from the tip of its tail.',
  },
];

export function getPokemonById(
  id: number
): Observable<Pokemon> {
  const pokemon = pokedex.find((pk) => pk.id === id);

  if (!pokemon) {
    return EMPTY.pipe(delay(1));
  }

  return of(pokemon).pipe(delay(1));
}
