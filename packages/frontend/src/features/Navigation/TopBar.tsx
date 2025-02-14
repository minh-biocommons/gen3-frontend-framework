import React, { ReactElement } from 'react';
import { Icon } from '@iconify/react';
import { Divider } from '@mantine/core';
import { mergeDefaultTailwindClassnames } from '../../utils/mergeDefaultTailwindClassnames';
import LoginButton from '../../components/Login/LoginButton';
import LoginAccountButton from '../../components/Login/LoginAccountButton';
import { extractClassName } from './utils';
import { LoginButtonVisibility } from '../../components/Login/types';
import { StylingOverrideWithMergeControl } from '../../types';

export interface NameAndIcon {
  readonly name: string;
  readonly rightIcon?: string;
  readonly leftIcon?: string;
  readonly classNames: StylingOverrideWithMergeControl;
  readonly drawBorder?: boolean;
}

export interface TopIconButtonProps extends NameAndIcon {
  readonly href: string;
  readonly tooltip?: string;
}

const TopIconButton = ({
  name,
  leftIcon = undefined,
  rightIcon = undefined,
  classNames = {},
  drawBorder = true,
}: NameAndIcon) => {
  const classNamesDefaults = {
    root: `flex items-center align-middle px-2 my-2`,
    button:
      'flex flex-nowrap items-center align-middle border-b-2 hover:border-accent border-transparent',
    leftIcon: 'text-secondary-contrast-lighter pr-1',
    label: 'font-content text-secondary-contrast-lighter block',
    rightIcon: 'text-secondary-contrast-lighter pl-1',
  };
  const mergedClassnames = mergeDefaultTailwindClassnames(
    classNamesDefaults,
    classNames,
  );

  return (
    <div
      className={extractClassName('root', mergedClassnames)}
      aria-label={name}
    >
      <div
        className={extractClassName('button', mergedClassnames)}
        role="button"
      >
        {leftIcon ? (
          <Icon
            icon={leftIcon}
            className={extractClassName('leftIcon', mergedClassnames)}
          />
        ) : null}
        <p className={extractClassName('label', mergedClassnames)}> {name} </p>
        {rightIcon ? (
          <Icon
            icon={rightIcon}
            className={extractClassName('rightIcon', mergedClassnames)}
          />
        ) : null}
      </div>
    </div>
  );
};

const processTopBarItems = (
  items: TopIconButtonProps[],
  showLogin: boolean,
): ReactElement[] => {
  return items.reduce(
    (acc: ReactElement[], item: TopIconButtonProps, index: number) => {
      const needsBorder = !(index === items.length - 1 && !showLogin);
      acc.push(
        <a className="flex" href={item.href} key={`${item.href}_${item.name}`}>
          {' '}
          <TopIconButton
            name={item.name}
            leftIcon={item.leftIcon}
            rightIcon={item.rightIcon}
            classNames={item.classNames}
            drawBorder={needsBorder}
          />{' '}
          <Divider
            size="md"
            color="accent.4"
            orientation="vertical"
            classNames={{ root: 'my-2' }}
          />
        </a>,
      );
      return acc;
    },
    [],
  );
};

export interface TopBarProps {
  readonly items: TopIconButtonProps[];
  readonly loginButtonVisibility?: LoginButtonVisibility;
  readonly externalLoginUrl?: string;
  readonly classNames?: StylingOverrideWithMergeControl;
}

const TopBar = ({
  items,
  loginButtonVisibility = LoginButtonVisibility.Hidden,
  externalLoginUrl,
  classNames = {},
}: TopBarProps) => {
  const classNamesDefaults = {
    root: 'flex justify-end items-center align-middle w-100 bg-secondary-lighter',
    login: 'font-content hover:border-accent',
  };

  const mergedClassnames = mergeDefaultTailwindClassnames(
    classNamesDefaults,
    classNames,
  );

  return (
    <div>
      <header className={extractClassName('root', mergedClassnames)}>
        <div
          role="navigation"
          aria-label="top most navigation"
          className="flex items-center align-middle"
        >
          {processTopBarItems(
            items,
            loginButtonVisibility === LoginButtonVisibility.Visible,
          )}
          {loginButtonVisibility != LoginButtonVisibility.Hidden ? (
            <div className="flex items-center">
              <LoginAccountButton
                className={extractClassName('login', mergedClassnames)}
              />
              <Divider size="md" color="accent.4" orientation="vertical" />
            </div>
          ) : null}
          {loginButtonVisibility != LoginButtonVisibility.Hidden ? (
            <div className="flex items-center">
              <LoginButton
                visibility={loginButtonVisibility}
                externalLoginUrl={externalLoginUrl}
                className={extractClassName('login', mergedClassnames)}
              />
            </div>
          ) : null}
        </div>
      </header>
    </div>
  );
};

export default TopBar;
