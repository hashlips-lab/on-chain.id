import React from 'react';
import styles from './Button.module.scss';

export interface ButtonProps {
  type:
    | 'borderRedBgWhiteTextRed'
    | 'borderBlueBgBlueTextWhite'
    | 'borderBlueBgWhiteTextBlue'
    | 'borderGreyBgWhiteTextGrey'
    | 'borderRedBgRedTextWhite';
  size: 'sm' | 'md' | 'lg';
  children: any;
  onClick?: () => void;
  disabled?: boolean;
}
const Button = ({ type, children, onClick, size, disabled }: ButtonProps) => {
  return (
    <button
      onClick={() => onClick?.()}
      className={`${styles.button} ${styles[type]}  ${styles[size]}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
