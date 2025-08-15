'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import React, {useEffect, useRef, useState} from 'react';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

export const SignUp: React.FC = () => {
  const router = useRouter();
  const footerRef = useRef<HTMLElement>(null);

  const [footerHeight, setFooterHeight] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const {form, handleChangeField} = hooks.useFormField({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (footerRef.current) {
      setFooterHeight(footerRef.current.offsetHeight);
    }
  }, []);

  const renderHeader = () => {
    return <components.Header title="Sign Up" showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          marginBottom: footerHeight,
          paddingTop: '10%',
          paddingLeft: 20,
          paddingRight: 20,
          height: '100%',
          width: '100%',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            ...constants.typography.h2,
            textTransform: 'capitalize',
            marginBottom: 10,
            color: constants.colors.seaGreenColor,
          }}
        >
          Welcome to MESIO
        </h2>
        <p
          style={{
            textAlign: 'center',
            fontSize: 16,
            marginBottom: 28,
            color: constants.colors.textColor,
          }}
        >
          Sign up to continue
        </p>
        <components.Input
          containerStyle={{marginBottom: 15}}
          placeholder="Full Name"
          value={form.email}
          onClickAction={() => handleChangeField('email', 'email')}
          isValid={form.email.length > 0 && form.email.includes('@')}
        />
        <components.Input
          containerStyle={{marginBottom: 15}}
          placeholder="Phone Number"
          value={form.phoneNumber}
          onClickAction={() => handleChangeField('phoneNumber', 'phone number')}
        />
        <components.Input
          containerStyle={{marginBottom: 15}}
          placeholder="Email"
          value={form.email}
          onClickAction={() => handleChangeField('email', 'Email')}
        />
        <components.Input
          containerStyle={{marginBottom: 15}}
          placeholder="Password"
          value={form.password}
          onClickAction={() => handleChangeField('password', 'Password')}
        />
        <components.Input
          containerStyle={{marginBottom: 15}}
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onClickAction={() =>
            handleChangeField('confirmPassword', 'confirm password')
          }
        />
        <div
          onClick={() => setAgreeToTerms(!agreeToTerms)}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 20,
          }}
        >
          <components.Checkbox checked={agreeToTerms} />
          <span style={{color: constants.colors.textColor}}>
            You agree to our Terms of Service
          </span>
        </div>

        <components.Button
          label="Sign Up"
          onClickAction={() => {
            router.push(constants.routes.verifyYourPhoneNumber);
          }}
        />
      </main>
    );
  };

  const renderFooter = () => {
    return (
      <section
        ref={footerRef}
        style={{
          display: 'flex',
          padding: 20,
          flexDirection: 'row',
          gap: 6,
          justifyContent: 'center',
        }}
      >
        <span style={{color: constants.colors.mainDarkColor}}>
          Already have an account?
        </span>
        <Link
          href={constants.routes.signIn}
          style={{color: constants.colors.seaGreenColor, fontWeight: 500}}
        >
          Sing in!
        </Link>
      </section>
    );
  };

  return (
    <components.SafeAreaView>
      {renderHeader()}
      {renderContent()}
      {renderFooter()}
    </components.SafeAreaView>
  );
};
