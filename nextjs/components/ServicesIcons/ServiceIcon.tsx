import React from 'react';
import styles from './ServiceIcon.module.scss';

const ServiceIcon = ({ serviceKey, className }: { serviceKey: string, className?: string }) => {
  const getLetters = (serviceKey: string) => {
    const regexServiceKey = serviceKey.match(/[A-Z]/g);

    if (regexServiceKey && (regexServiceKey.length >= 2)) {
      return regexServiceKey[0]+regexServiceKey[1];
    }

    return serviceKey.substring(0, 2);
  };

  const classNames = styles.serviceIcon + (className ? ` ${className}`: '');

  return (
    <div className={classNames} title={serviceKey} >
      {getLetters(serviceKey)}
    </div>
  );
};

export default ServiceIcon;
