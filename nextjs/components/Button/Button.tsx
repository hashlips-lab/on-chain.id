import React from 'react';
import styles from './Button.module.scss';

export interface ButtonProps {
  type:
    | "borderRedBgWhiteTextRed"
    | "borderBlueBgBlueTextWhite"
    | "borderBlueBgWhiteTextBlue"
    | "borderGreyBgWhiteTextGrey"
    | "borderRedBgRedTextWhite";
  size: "sm" | "md" | "lg";
  children: any;
  onClick?: () => void;
  disabled?: boolean;
  loading: boolean;
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
      disabled={disabled}
      loading={loading}
      onClick={() => onClick?.()}
      className={`${styles.button} ${styles[type]}  ${styles[size]}`}
      disabled={disabled}
    >
      {loading ? <>BUSY...</> : children}
    </button>
  );
};

export default Button;
