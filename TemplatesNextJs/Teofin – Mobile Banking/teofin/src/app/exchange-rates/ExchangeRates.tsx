'use client';

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

import React from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';
import {useAppSelector} from '@/store/store';
import {useAppDispatch} from '@/store/store';
import {exchangeRatesActions} from '@/store/exchangeRates';

export const ExchangeRates: React.FC = () => {
  hooks.useThemeColor('#fff');
  hooks.useBodyColor('#fff');

  const router = useRouter();

  const dispatch = useAppDispatch();

  const eRates = useAppSelector((state) => state.exchangeRates.rates);

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        title="Exchange rates"
        containerStyle={{backgroundColor: constants.colors.whiteColor}}
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        style={{
          paddingBottom: 20,
          paddingTop: 10,
          marginTop: constants.sizes.headerHeight,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 10,
            paddingBottom: 10,
            paddingLeft: 20,
            paddingRight: 20,
            borderBottom: '1px solid #ced6e1',
            marginBottom: 8,
          }}
        >
          <span>Currency</span>
          <span style={{textAlign: 'end'}}>$1</span>
          <span style={{textAlign: 'end'}}>in Dollars</span>
        </div>
        <ul
          style={{
            width: '100%',
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          {rates.map((rate) => {
            const selected = eRates.symbol === rate.symbol;
            return (
              <li key={rate.code} style={{width: '100%'}}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: 10,
                    paddingBottom: 10,
                    paddingTop: 8,
                    width: '100%',
                    borderBottom: '1px solid #ced6e1',
                    backgroundColor: selected ? '#e8f0fe' : '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onClick={() => {
                    dispatch(exchangeRatesActions.setExchangeRates(rate));
                    router.back();
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 10,
                    }}
                  >
                    <div style={{marginTop: 3}}>
                      <img
                        src={rate.currencyIcon}
                        alt={rate.code}
                        style={{width: 21, height: 14}}
                      />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <h5 style={{...constants.typography.h5}}>{rate.code}</h5>
                      <span
                        className="number-of-lines-1"
                        style={{
                          fontSize: 12,
                          color: constants.colors.bodyTextColor,
                        }}
                      >
                        {rate.name}
                      </span>
                    </div>
                  </div>
                  <h5 style={{textAlign: 'end'}}>{rate.per1USD}</h5>
                  <h5 style={{textAlign: 'end'}}>{rate.toUSD}</h5>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderHeader()}
        {renderContent()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};
