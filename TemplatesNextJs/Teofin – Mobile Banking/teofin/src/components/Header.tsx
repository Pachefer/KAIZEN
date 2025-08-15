'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {useAppSelector} from '@/store/store';

type Props = {
  title?: string;
  showUser?: boolean;
  showGoBack?: boolean;
  showBorder?: boolean;
  showCurrency?: boolean;
  showCreditCard?: boolean;
  containerStyle?: React.CSSProperties;
};

export const Header: React.FC<Props> = ({
  title,
  showUser,
  showGoBack,
  showBorder,
  showCurrency,
  showCreditCard,
  containerStyle,
}) => {
  const router = useRouter();
  const isMobile = hooks.useIsMobile();

  const {rates} = useAppSelector((state) => state.exchangeRates);

  const renderGoBack = () => {
    if (!showGoBack) return null;

    return (
      <button
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          position: 'absolute',
          left: 0,
        }}
        onClick={() => {
          router.back();
        }}
      >
        <svg.GoBackSvg />
      </button>
    );
  };

  const renderShowUser = () => {
    if (!showUser) return null;

    return (
      <button
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          position: 'absolute',
          left: 0,
        }}
        onClick={() => {
          router.push(constants.routes.profile);
        }}
      >
        <img
          src={'/icons/31.png'}
          alt="User Icon"
          style={{width: 22, height: 22}}
        />
      </button>
    );
  };

  const renderTitle = () => {
    return (
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <h4 style={{...constants.typography.h4, fontSize: 18}}>{title}</h4>
      </div>
    );
  };

  const renderCurrency = () => {
    if (!showCurrency) return null;
    return (
      <button
        style={{
          position: 'absolute',
          right: '50%',
          transform: 'translateX(50%)',
        }}
        onClick={() => {
          router.push(constants.routes.exchangeRates);
        }}
      >
        <span>
          {rates.symbol} {rates.per1USD} / {rates.toUSD}
        </span>
      </button>
    );
  };

  const renderCreditCard = () => {
    if (!showCreditCard) return null;
    return (
      <button
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          position: 'absolute',
          right: 0,
        }}
        onClick={() => {
          router.push(constants.routes.cardMenu);
        }}
      >
        <svg.HeaedrCardSvg />
      </button>
    );
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 'var(--safe-top)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        zIndex: 2,
        height: constants.sizes.headerHeight,
        maxWidth: isMobile ? '100%' : constants.sizes.screenWidth,
        backgroundColor: constants.colors.antiFlashWhite,
        borderBottomWidth: 1,
        borderBottomColor: showBorder ? '#CED6E1' : 'transparent',
        borderBottomStyle: 'solid',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...containerStyle,
      }}
    >
      {renderGoBack()}
      {renderShowUser()}
      {renderTitle()}
      {renderCurrency()}
      {renderCreditCard()}
    </header>
  );
};
