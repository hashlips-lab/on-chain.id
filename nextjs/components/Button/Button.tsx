import React from 'react';
import styles from './Button.module.scss';

export interface ButtonProps {
  type:
    | 'borderRedBgWhiteTextRed'
    | 'borderBlueBgBlueTextWhite'
    | 'borderBlueBgWhiteTextBlue'
    | 'borderGreyBgWhiteTextGrey'
    | 'borderRedBgRedTextWhite'
    | 'borderWhiteBgWhiteTextBlue';
  size: 'sm' | 'md' | 'lg';
  children: any;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const Button = ({
  type,
  children,
  onClick,
  size,
  disabled,
  loading,
}: ButtonProps) => {
  return (
    <button
      onClick={() => onClick?.()}
      className={`${styles.button} ${styles[type]}  ${styles[size]}`}
      disabled={disabled}
    >
      {loading ? <>BUSY...</> : children}
    </button>
  );
};

export default Button;
