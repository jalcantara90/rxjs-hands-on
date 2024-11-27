import { Product } from '../types';
import { anyTimeFare, singleAdvanceFare, offPeakFare } from './fares';

export const londonToManchester: Product = {
  id: 1,
  origin: 'London',
  destination: 'Manchester',
  fare: singleAdvanceFare,
};
export const manchesterToLondon: Product = {
  id: 2,
  origin: 'Manchester',
  destination: 'London',
  fare: anyTimeFare,
};
export const birminghamToLondon: Product = {
  id: 3,
  origin: 'Birmingham',
  destination: 'London',
  fare: singleAdvanceFare,
};
export const londonToBirmingham: Product = {
  id: 4,
  origin: 'London',
  destination: 'Birmingham',
  fare: anyTimeFare,
};
export const birminghamToGlasgow: Product = {
  id: 5,
  origin: 'Birmingham',
  destination: 'Glasgow',
  fare: offPeakFare,
};
export const glasGowToBirmingham: Product = {
  id: 6,
  origin: 'Glasgow',
  destination: 'Birmingham',
  fare: singleAdvanceFare,
};

export const products = [
  londonToManchester,
  manchesterToLondon,
  birminghamToLondon,
  birminghamToGlasgow,
  londonToBirmingham,
  glasGowToBirmingham,
];
