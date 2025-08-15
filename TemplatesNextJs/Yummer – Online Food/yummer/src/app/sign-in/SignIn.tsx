'use client';

import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

export const SignIn: React.FC = () => {
  const router = useRouter();

  const {form, handleChangeField} = hooks.useFormField({
    email: '',
    password: '',
  });

  const handleSignIn = () => {
    router.push(constants.routes.home);
  };

  const renderHeader = () => {
    return <components.Header title="Sign In" showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          paddingLeft: 20,
          paddingRight: 20,
          overflowY: 'auto',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1
          style={{
            ...constants.typography.h1,
            textTransform: 'capitalize',
            marginBottom: 40,
            color: constants.colors.titlesColor,
          }}
        >
          Sign in
        </h1>
        <components.Input
          containerStyle={{marginBottom: 30}}
          placeholder="kristinwatson@mail.com"
          value={form.email}
          label="Email"
          onClickAction={() => handleChangeField('email', 'email')}
          isValid={form.email.length > 0 && form.email.includes('@')}
          rightIcon={form.email ? <svg.CheckSvg /> : <></>}
        />
        <components.Input
          containerStyle={{marginBottom: 20}}
          placeholder="**********"
          value={form.password}
          label="Password"
          onClickAction={() => handleChangeField('password', 'password')}
          isValid={form.password.length > 0 && form.password.length >= 6}
          rightIcon={<svg.EyeOffSvg />}
        />
        <div
          style={{
            ...constants.flex.rowCenterBetween,
            marginBottom: 30,
            width: '100%',
            justifyContent: 'flex-end',
          }}
        >
          <Link
            href={constants.routes.forgotPassword}
            style={{color: constants.colors.mainColor2}}
          >
            Forgot your password?
          </Link>
        </div>
        <components.Button
          label="Sign in"
          onClickAction={() => handleSignIn()}
          containerStyle={{marginBottom: 20}}
        />
        <div style={{marginBottom: '14%'}}>
          <span style={{color: constants.colors.textColor}}>
            Don’t have an account?{' '}
            <span style={{color: constants.colors.mainColor2}}>
              <Link href={constants.routes.signUp}>Sign up.</Link>
            </span>
          </span>
        </div>
        <div
          style={{
            ...constants.flex.rowAlignCenterCenter,
            gap: 15,
          }}
        >
          <Link href={constants.routes.home}>
            <svg.FacebookSvg />
          </Link>
          <Link href={constants.routes.home}>
            <svg.TwitterSvg />
          </Link>
          <Link href={constants.routes.home}>
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
