import styles from "./Button.module.scss";

export interface ButtonProps {
  type:
    | "borderRedBgWhiteTextRed"
    | "borderBlueBgBlueTextWhite"
    | "borderBlueBgWhiteTextBlue";
  size: "sm" | "md" | "lg";
  children: any;
  onClick?: () => void;
}
const Button = ({ type, children, onClick, size }: ButtonProps) => {
  return (
    <button
      onClick={() => onClick?.()}
      className={`${styles.button} ${styles[type]}  ${styles[size]}`}
    >
      {children}
    </button>
  );
};

export default Button;
