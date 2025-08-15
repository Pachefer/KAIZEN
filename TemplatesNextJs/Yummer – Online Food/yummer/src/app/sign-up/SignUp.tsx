'use client';

import {useRouter} from 'next/navigation';
import Link from 'next/link';
import React, {useEffect, useRef, useState} from 'react';

import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

export const SignUp: React.FC = () => {
  const router = useRouter();
  const footerRef = useRef<HTMLElement>(null);

  const [footerHeight, setFooterHeight] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (footerRef.current) {
      setFooterHeight(footerRef.current.offsetHeight);
    }
  }, []);

  const handleChangeField = (field: keyof typeof form, label: string) => {
    const result = window.prompt(`Enter your ${label}`, form[field]);
    if (result !== null) {
      setForm((prev) => ({...prev, [field]: result}));
    }
  };

  const renderHeader = () => {
    return <components.Header title="Sign Up" showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          marginBottom: footerHeight,
          paddingTop: '14%',
          paddingLeft: 20,
          paddingRight: 20,
          height: '100%',
          width: '100%',
          overflowY: 'auto',
        }}
      >
        <h2
          style={{
            textTransform: 'capitalize',
            marginBottom: 40,
            ...constants.typography.h1,
          }}
        >
          Sign up
        </h2>
        <div style={{...constants.flex.flexColumn, gap: 20}}>
          <components.Input
            label="Name"
            placeholder="Kristin Watson"
            value={form.name}
            onClickAction={() => handleChangeField('name', 'name')}
            isValid={form.name.length > 0}
          />
          <components.Input
            label="Email"
            placeholder="kristinwatson@mail.com"
            value={form.email}
            onClickAction={() => handleChangeField('email', 'email')}
          />
          <components.Input
            label="Password"
            placeholder="••••••••"
            value={form.password}
            inputType="password"
            onClickAction={() => handleChangeField('password', 'password')}
          />
          <components.Input
            label="Confirm Password"
            containerStyle={{marginBottom: 30}}
            placeholder="••••••••"
            value={form.confirmPassword}
            inputType="password"
            onClickAction={() =>
              handleChangeField('confirmPassword', 'confirm password')
            }
          />
        </div>

        <components.Button
          label="Sign Up"
          onClickAction={() => {
            router.push(constants.routes.verifyYourPhoneNumber);
          }}
          containerStyle={{marginBottom: 20}}
        />
        <div style={{marginBottom: '14%'}}>
          <span>
            Already have an account?
            <Link
              href={constants.routes.signIn}
              style={{
                color: constants.colors.mainColor2,
                marginLeft: 4,
              }}
            >
              Sign In.
            </Link>
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
