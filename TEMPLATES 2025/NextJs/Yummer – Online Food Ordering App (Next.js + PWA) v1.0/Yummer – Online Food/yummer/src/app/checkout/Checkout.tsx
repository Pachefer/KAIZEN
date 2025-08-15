'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect, useRef, useState} from 'react';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

export const Checkout: React.FC = () => {
  hooks.useThemeColor('#EEF3FC');
  hooks.useBodyColor('#EEF3FC');

  const router = useRouter();
  const [buttonSectionHeight, setButtonSectionHeight] = useState(0);

  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      setButtonSectionHeight(buttonRef.current.offsetHeight);
    }
  }, []);

  const {form, handleChangeField} = hooks.useFormField({
    fullName: '',
    address: '',
    phoneNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handlePlaceOrder = () => {
    router.push(constants.routes.OrderSuccess);
  };

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Checkout" />;
  };

  const renderShippingDetails = () => {
    return (
      <section style={{marginBottom: 30}}>
        <h4 style={{marginBottom: 14, ...constants.typography.h4}}>
          Shipping Details
        </h4>
        <div style={{...constants.flex.flexColumn, gap: 20}}>
          <components.Input
            label="Name"
            placeholder="Kristin Watson"
            value={form.fullName}
            onClickAction={() => handleChangeField('fullName', 'fullName')}
          />
          <components.Input
            label="Address"
            placeholder="8000 S Kirkland Ave, Chicago, IL 6065..."
            value={form.address}
            onClickAction={() => handleChangeField('address', 'address')}
          />
          <components.Input
            label="Phone Number"
            placeholder="+17123456789"
            value={form.phoneNumber}
            onClickAction={() =>
              handleChangeField('phoneNumber', 'phoneNumber')
            }
          />
        </div>
      </section>
    );
  };

  const renderCardDetails = () => {
    return (
      <section style={{marginBottom: 20}}>
        <h4 style={{marginBottom: 14, ...constants.typography.h4}}>
          Card Details
        </h4>
        <div style={{...constants.flex.flexColumn, gap: 20}}>
          <components.Input
            label="Card Number"
            value={form.cardNumber}
            placeholder="7741 ******** 6644"
            onClickAction={() => handleChangeField('cardNumber', 'Card Number')}
          />
          <components.Input
            label="Expiry Date"
            value={form.expiryDate}
            placeholder="01/26"
            onClickAction={() => handleChangeField('expiryDate', 'MM/YY')}
          />
          <components.Input
            label="CVV"
            value={form.cvv}
            placeholder="123"
            onClickAction={() => handleChangeField('cvv', 'CVV')}
          />
        </div>
      </section>
    );
  };

  const renderButton = () => {
    return (
      <div
        ref={buttonRef}
        style={{
          padding: 20,
          backgroundColor: constants.colors.whiteColor,
          borderTop: '1px solid #E2E2E2',
          position: 'fixed',
          bottom: 'env(safe-area-inset-bottom)',
          left: 0,
          right: 0,
        }}
      >
        <components.Button
          label="Place Order"
          onClickAction={() => {
            handlePlaceOrder();
          }}
        />
      </div>
    );
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          marginBottom: buttonSectionHeight,
          padding: 20,
          overflowY: 'auto',
        }}
      >
        {renderShippingDetails()}
        {renderCardDetails()}
        <components.SafeAreaInsetBottom />
      </main>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderHeader()}

        {renderContent()}
        {renderButton()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};
