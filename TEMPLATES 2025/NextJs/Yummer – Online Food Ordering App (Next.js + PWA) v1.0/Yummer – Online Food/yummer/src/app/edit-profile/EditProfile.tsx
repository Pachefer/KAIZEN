'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

export const EditProfile: React.FC = () => {
  const router = useRouter();
  const {form, handleChangeField} = hooks.useFormField({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
  });

  const handleUpdateProfile = () => {
    router.push(constants.routes.profile);
  };

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Edit Profile" />;
  };

  const renderContent = () => {
    return (
      <main style={{marginTop: constants.sizes.headerHeight, padding: 20}}>
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            display: 'block',
            margin: '0 auto',
            marginBottom: 40,
            position: 'relative',
          }}
        >
          <img
            src="https://george-fx.github.io/yummer-data/avatars/01.jpg"
            alt="User Avatar"
            style={{width: '100%', height: '100%', borderRadius: '50%'}}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: constants.colors.mainColor2,
              width: 30,
              height: 30,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg.ProfileEditSvg />
          </div>
        </div>
        <ul style={{...constants.flex.flexColumn, gap: 30, marginBottom: 30}}>
          <li>
            <components.Input
              label="Name"
              placeholder="Kristin Watson"
              value={form.fullName}
              onClickAction={() => handleChangeField('fullName', 'Full Name')}
            />
          </li>
          <li>
            <components.Input
              label="Email"
              placeholder="kristinwatson@mail.com"
              value={form.phone}
              onClickAction={() => handleChangeField('phone', 'Phone Number')}
            />
          </li>
          <li>
            <components.Input
              label="Phone Number"
              placeholder="Enter date of birth"
              value={form.dateOfBirth}
              onClickAction={() =>
                handleChangeField('dateOfBirth', 'Date of Birth')
              }
            />
          </li>
          <li>
            <components.Input
              label="Location"
              placeholder="Chicago, USA"
              value={form.address}
              onClickAction={() => handleChangeField('address', 'Location')}
            />
          </li>
        </ul>
        <components.Button
          label="save changes"
          onClickAction={handleUpdateProfile}
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
