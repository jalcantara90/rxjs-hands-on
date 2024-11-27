import { Fare } from '../types';

export const anyTimeFare: Fare = {
  type: 'Anytime',
  amount: 100,
  currencyCode: 'GBP',
};

export const offPeakFare: Fare = {
  type: 'Off-peak',

  amount: 200,
  currencyCode: 'GBP',
};

export const singleAdvanceFare: Fare = {
  type: 'Single-advance',

  amount: 50,
  currencyCode: 'GBP',
};

export const fares: Fare[] = [anyTimeFare, offPeakFare, singleAdvanceFare];
