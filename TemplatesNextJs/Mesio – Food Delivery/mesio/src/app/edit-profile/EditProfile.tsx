'use client';

import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
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

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Edit Profile" />;
  };

  const renderContent = () => {
    const h3Styles: React.CSSProperties = {
      color: constants.colors.mainDarkColor,
      fontSize: 16,
      marginBottom: 8,
    };

    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          padding: 20,
          overflowY: 'auto',
        }}
      >
        <ul style={{...constants.flex.column, gap: 18, marginBottom: 40}}>
          <li>
            <h3 style={h3Styles}>Full name</h3>
            <components.Input
              placeholder="Jhon Smith"
              value={form.fullName}
              onClickAction={() => handleChangeField('fullName', 'Full Name')}
            />
          </li>
          <li>
            <h3 style={h3Styles}>Telephone number</h3>
            <components.Input
              placeholder="0123 456 789"
              value={form.phone}
              onClickAction={() => handleChangeField('phone', 'Phone Number')}
            />
          </li>
          <li>
            <h3 style={h3Styles}>Date of birth</h3>
            <components.Input
              placeholder="Enter date of birth"
              value={form.dateOfBirth}
              onClickAction={() =>
                handleChangeField('dateOfBirth', 'Date of Birth')
              }
            />
          </li>
          <li>
            <h3 style={h3Styles}>Gender</h3>
            <components.Input
              placeholder="Enter gender"
              value={form.gender}
              onClickAction={() => handleChangeField('gender', 'Gender')}
            />
          </li>
          <li>
            <h3 style={h3Styles}>Address</h3>
            <components.Input
              placeholder="Enter Address"
              value={form.address}
              onClickAction={() => handleChangeField('address', 'Address')}
            />
          </li>
        </ul>
        <components.Button
          label="Update Now"
          onClickAction={() => {
            router.push(constants.routes.profile);
          }}
        />
        <Link
          href={constants.routes.changePassword}
          style={{
            width: '100%',
            marginTop: 20,
            ...constants.flex.rowCenter,
            color: constants.colors.seaGreenColor,
          }}
        >
          Change Password
        </Link>
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
