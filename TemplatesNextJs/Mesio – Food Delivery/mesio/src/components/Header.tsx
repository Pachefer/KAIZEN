'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {useAppSelector} from '@/lib/store';
import {useAppDispatch} from '@/lib/store';
import {modalActions} from '@/lib/modalSlice';

type Props = {
  title?: string;
  showBasket?: boolean;
  showGoBack?: boolean;
  showBurger?: boolean;
  titleStyle?: React.CSSProperties;
};

export const Header: React.FC<Props> = ({
  title,
  showGoBack,
  showBasket,
  showBurger,
  titleStyle,
}) => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const {total, list: cart} = useAppSelector((state) => state.cart);
  const {isOpen} = useAppSelector((state) => state.modalSlice);

  const renderGoBack = () => {
    if (!showGoBack) return null;

    return (
      <button
        style={{paddingLeft: 20, paddingRight: 20}}
        onClick={() => {
          router.back();
        }}
      >
        <svg.GoBackSvg />
      </button>
    );
  };

  const renderBurger = () => {
    if (!showBurger) return null;
    return (
      <button
        style={{paddingLeft: 20, paddingRight: 20}}
        onClick={() => {
          dispatch(modalActions.setIsOpen(!isOpen));
        }}
      >
        <svg.BurgerSvg />
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
            color: constants.colors.mainDarkColor,
            ...titleStyle,
            fontWeight: 400,
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
        }}
        onClick={() => {
          if (cart.length > 0) {
            router.push(constants.routes.order);
          }
        }}
      >
        <div
          style={{
            backgroundColor: constants.colors.redColor,
            height: 20,
            borderRadius: 10,
            position: 'absolute',
            top: 18,
            right: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 6,
            paddingRight: 6,
          }}
        >
          <span
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
          backgroundColor: constants.colors.whiteColor,
        }}
      >
        {renderBurger()}
        {renderGoBack()}
        {renderTitle()}
        {renderBasket()}
      </header>
    );
  };

  return renderContent();
};
