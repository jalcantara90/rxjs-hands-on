/* eslint-disable no-unused-vars */
export interface Fare {
  type: 'Anytime' | 'Off-peak' | 'Single-advance';
  amount: number;
  currencyCode: string;
}

export interface Product {
  id: number;
  origin: string;
  destination: string;
  fare: Fare;
}

export interface CartProduct {
  name: string;
  quantity: number;
}

export type Cart = CartProduct[];

export interface Pokemon {
  id: number;
  name: string;
  description: string;
}
