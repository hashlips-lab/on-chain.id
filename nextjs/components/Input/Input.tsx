import styles from './Input.module.scss';

interface Input {
  placeholder: string;
  onChange: (e: any) => void;
}

const Input = ({ placeholder, onChange }: Input) => {
  return (
    <input
      className={styles.input}
      placeholder={placeholder}
      onChange={(e) => onChange(e)}
    />
  );
};

export default Input;
