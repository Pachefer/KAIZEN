'use client';

import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

export const SignUp: React.FC = () => {
  const router = useRouter();

  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const {form, handleChangeField} = hooks.useFormField({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Sign Up" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight + 10,
          paddingTop: '10%',
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h1
          style={{
            ...constants.typography.h1,
            textAlign: 'center',
            marginBottom: 30,
          }}
        >
          Sign up!
        </h1>
        <components.InputField
          value={form.name}
          placeholder="Cristina Wolf"
          containerStyle={{marginBottom: 14}}
          onClickAction={() => handleChangeField('name', 'name')}
        />
        <components.InputField
          value={form.email}
          placeholder="cristinawolf@mail.com"
          containerStyle={{marginBottom: 14}}
          onClickAction={() => handleChangeField('email', 'email')}
        />
        <components.InputField
          value={form.password}
          placeholder="••••••••"
          containerStyle={{marginBottom: 14}}
          inputType="password"
          onClickAction={() => handleChangeField('password', 'password')}
        />
        <components.InputField
          value={form.confirmPassword}
          placeholder="••••••••"
          containerStyle={{marginBottom: 14}}
          inputType="password"
          onClickAction={() =>
            handleChangeField('confirmPassword', 'confirmPassword')
          }
        />
        <components.Button
          title="Sign Up"
          containerStyle={{marginBottom: 30}}
          onClickAction={() => {
            router.push(constants.routes.verifyYourPhoneNumber);
          }}
        />
        <span style={{...constants.typography.bodyText, marginBottom: '16%'}}>
          Already have an account?{' '}
          <Link
            href={constants.routes.signIn}
            style={{color: constants.colors.linkColor}}
          >
            Sign in.
          </Link>
        </span>
        <div style={{display: 'flex', gap: 10, alignSelf: 'center'}}>
          <Link href={constants.routes.dashboard}>
            <svg.FacebookSvg />
          </Link>
          <Link href={constants.routes.dashboard}>
            <svg.TwitterSvg />
          </Link>
          <Link href={constants.routes.dashboard}>
            <svg.GoogleSvg />
          </Link>
        </div>
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
