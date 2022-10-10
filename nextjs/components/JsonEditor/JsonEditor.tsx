import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useAccount } from 'wagmi';
import { useDebounce } from 'use-debounce';
import Editor from 'react-simple-code-editor';
import { Validator } from '@cfworker/json-schema';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-dark.css';
import styles from './JsonEditor.module.scss';
import jsonSchema from './../../assets/schema.json';

const JsonEditor = (props: { jsonPermissionSetCallback: Dispatch<SetStateAction<any>> }) => {
  const { address } = useAccount();
  const defaultValue = {
    'providerAddress': address,
    'requiredPermissions': [
      'Facebook',
    ],
  };
  const [ jsonValue, setJsonValue ] = useState<string>(JSON.stringify(defaultValue, null, '\t'));
  const [ debouncedJsonValue ] = useDebounce(jsonValue, 500);
  const [ jsonValidationErrors, setJsonValidationErrors ] = useState<any>();
  const validator = new Validator(jsonSchema as any);

  useEffect(() => {
    let typeFixedJson;

    try {
      typeFixedJson = JSON.parse(debouncedJsonValue);
    } catch {
      typeFixedJson = debouncedJsonValue;
    }

    const validatedJsonSchema = validator.validate(typeFixedJson);

    setJsonValidationErrors(validatedJsonSchema.errors);

    if(validatedJsonSchema.valid) {
      props.jsonPermissionSetCallback(typeFixedJson);

      return;
    }

    props.jsonPermissionSetCallback(undefined);
  }, [ debouncedJsonValue ]);

  return (
    <div className={styles.jsonEditorContainer}>
      <Editor
        className={styles.codeEditor}
        value={jsonValue}
        onValueChange={code => setJsonValue(code)}
        highlight={code => highlight(code, languages.json, 'json')}
        padding={10}
      />

      {(jsonValidationErrors && jsonValidationErrors.length !== 0) &&
      <>
        <h3>Warning: </h3>
        <ul>
          { jsonValidationErrors.map((error: any, i: number) => <li key={i}>{error.error}</li>) }
        </ul>
      </>}
    </div>
  );
};

export default JsonEditor;
