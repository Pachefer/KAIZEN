'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {useAppSelector} from '@/lib/store';

type Props = {
  title?: string;
  showUser?: boolean;
  showSkip?: boolean;
  showBasket?: boolean;
  showGoBack?: boolean;
  showBurger?: boolean;
  titleStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
};

export const Header: React.FC<Props> = ({
  title,
  showGoBack,
  showBasket,
  titleStyle,
  showSkip,
  showUser,
  containerStyle,
}) => {
  const router = useRouter();
  const {total} = useAppSelector((state) => state.cart);

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

  const renderUser = () => {
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
          router.push(constants.routes.editProfile);
        }}
      >
        <img
          src={'https://george-fx.github.io/yummer-data/avatars/01.jpg'}
          alt="User"
          style={{width: 24, height: 24, borderRadius: '50%'}}
        />
      </button>
    );
  };

  const renderSkip = () => {
    if (!showSkip) return null;

    return (
      <button
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          position: 'absolute',
          right: 0,
        }}
        onClick={() => {
          router.push(constants.routes.signIn);
        }}
      >
        <svg.SkipSvg />
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
        <h4
          style={{
            ...titleStyle,
            ...constants.typography.h4,
          }}
        >
          {title}
        </h4>
      </div>
    );
  };

  const renderBasket = () => {
    if (!showBasket) return null;

    return (
      <button
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          position: 'absolute',
          right: 0,
        }}
        onClick={() => {
          router.push(constants.routes.order);
        }}
      >
        <div
          style={{
            backgroundColor: constants.colors.mainColor2,
            height: 20,
            borderRadius: 10,
            position: 'absolute',
            top: 8,
            right: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 6,
            paddingRight: 6,
          }}
        >
          <span
            key={total}
            style={{
              color: constants.colors.whiteColor,
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            ${total > 0 ? total.toFixed(2) : '0'}
          </span>
        </div>
        <svg.ShoppingBagSvg />
      </button>
    );
  };

  const renderContent = () => {
    return (
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          zIndex: 3,
          height: constants.sizes.headerHeight,
          maxWidth: constants.sizes.screenWidth,
          margin: '0 auto',
          ...constants.flex.rowCenterBetween,
          backgroundColor: constants.colors.aliceBlue,
          ...containerStyle,
        }}
      >
        {renderUser()}
        {renderGoBack()}
        {renderSkip()}
        {renderTitle()}
        {renderBasket()}
      </header>
    );
  };

  return renderContent();
};
