import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export const rates = [
  {
    code: 'GBP',
    name: 'British Pound',
    per1USD: 0.866,
    toUSD: 1.155,
    currencyIcon: 'https://george-fx.github.io/teofin-data/exchange/gbp.png',
    symbol: '£',
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    per1USD: 0.963,
    toUSD: 1.039,
    currencyIcon: 'https://george-fx.github.io/teofin-data/exchange/chf.png',
    symbol: 'CHF',
  },
  {
    code: 'EUR',
    name: 'Euro',
    per1USD: 1.0,
    toUSD: 0.999,
    currencyIcon: 'https://george-fx.github.io/teofin-data/exchange/eur.png',
    symbol: '€',
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    per1USD: 1.32,
    toUSD: 0.759,
    currencyIcon: 'https://george-fx.github.io/teofin-data/exchange/cad.png',
    symbol: 'C$',
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    per1USD: 1.48,
    toUSD: 0.674,
    currencyIcon: 'https://george-fx.github.io/teofin-data/exchange/aud.png',
    symbol: 'A$',
  },
  {
    code: 'CNY',
    name: 'Chinese Yuan Renminbi',
    per1USD: 6.96,
    toUSD: 0.144,
    currencyIcon: 'https://george-fx.github.io/teofin-data/exchange/cny.png',
    symbol: '¥',
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    per1USD: 79.5,
    toUSD: 0.013,
    currencyIcon: 'https://george-fx.github.io/teofin-data/exchange/inr.png',
    symbol: '₹',
  },
];

type ExchangeRatesState = {
  rates: {
    symbol: string;
    per1USD: number;
    toUSD: number;
  };
};

const initialState: ExchangeRatesState = {
  rates: {
    symbol: rates[2].symbol,
    per1USD: rates[2].per1USD,
    toUSD: rates[2].toUSD,
  },
};

export const exchangeRatesSlice = createSlice({
  name: 'exchangeRates',
  initialState,
  reducers: {
    setExchangeRates: (state, action: PayloadAction<any>) => {
      const {symbol, per1USD, toUSD} = action.payload;
      state.rates = {
        symbol,
        per1USD,
        toUSD,
      };
    },
  },
});

export const exchangeReducer = exchangeRatesSlice.reducer;
export const exchangeRatesActions = exchangeRatesSlice.actions;
