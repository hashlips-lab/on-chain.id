import styles from './Input.module.scss';

interface Input {
  placeholder: string;
  onChange: (e: any) => void;
  required?: boolean;
  pattern?: string;
}

const Input = ({ placeholder, onChange, required, pattern }: Input) => {
  return (
    <input
      className={styles.input}
      placeholder={placeholder}
      onChange={(e) => onChange(e)}
      required={required}
      pattern={pattern}
    />
  );
};

export default Input;
