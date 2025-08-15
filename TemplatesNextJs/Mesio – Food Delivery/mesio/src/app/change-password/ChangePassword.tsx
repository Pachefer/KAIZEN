'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

export const ChangePassword: React.FC = () => {
  const router = useRouter();
  const {form, handleChangeField} = hooks.useFormField({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Change Password" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          paddingTop: 25,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
        }}
      >
        <div style={{...constants.flex.column, gap: 11, marginBottom: 20}}>
          <components.Input
            placeholder="Old Password"
            value={form.oldPassword}
            onClickAction={() =>
              handleChangeField('oldPassword', 'Old Password')
            }
          />
          <components.Input
            placeholder="New Password"
            value={form.newPassword}
            onClickAction={() =>
              handleChangeField('newPassword', 'New Password')
            }
          />
          <components.Input
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onClickAction={() =>
              handleChangeField('confirmPassword', 'Confirm Password')
            }
          />
        </div>
        <components.Button
          label="Save Now!"
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
