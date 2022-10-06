import styles from "./Button.module.scss";

interface ButtonProps {
  type: "borderRedBgWhiteTextRed" | "borderBlueBgBlueTextWhite";
  children: any;
  onClick?: () => void;
}
const Button = ({ type, children, onClick }: ButtonProps) => {
  switch (type) {
    case "borderRedBgWhiteTextRed":
      return (
        <button
          onClick={() => onClick?.()}
          className={`${styles.button} ${styles.borderRedBgWhiteTextRed}`}
        >
          {children}
        </button>
      );
    case "borderBlueBgBlueTextWhite":
      return (
        <button
          onClick={() => onClick?.()}
          className={`${styles.button} ${styles.borderBlueBgBlueTextWhite}`}
        >
          {children}
        </button>
      );

    default:
      return <></>;
  }
};

export default Button;
