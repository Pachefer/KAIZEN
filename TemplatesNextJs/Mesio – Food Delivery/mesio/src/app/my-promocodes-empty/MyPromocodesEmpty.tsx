'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';
import {useFormField} from '@/hooks/useFormField';

export const MyPromocodesEmpty: React.FC = () => {
  const router = useRouter();
  const {form, handleChangeField} = useFormField({voucher: ''});

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="My Promocodes Empty" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          padding: 20,
          marginTop: constants.sizes.headerHeight,
          ...constants.flex.column,
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <div
          style={{marginBottom: 34, marginLeft: 'auto', marginRight: 'auto'}}
        >
          <svg.GiftSvg />
        </div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: constants.colors.seaGreenColor,
            marginBottom: 10,
            textAlign: 'center',
            textTransform: 'capitalize',
            maxWidth: 300,
          }}
        >
          You do not have Promocodes
        </h2>
        <p
          style={{
            textAlign: 'center',
            marginBottom: 24,
            color: constants.colors.textColor,
          }}
        >
          Go hunt for vouchers at Foodsss <br />
          Voucher right away.
        </p>
        <components.Input
          placeholder="Enter the voucher"
          containerStyle={{marginBottom: 15}}
          value={form.voucher}
          onClickAction={() => handleChangeField('voucher', 'voucher')}
        />
        <components.Button
          label="Submit"
          onClickAction={() => {
            router.push(constants.routes.profile);
          }}
        />
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
