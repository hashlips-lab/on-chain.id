import React from 'react';
import styles from './ServiceIcon.module.scss';

const ServiceIcon = ({ serviceKey, className }: { serviceKey: string, className?: string }) => {
  const classNames = styles.serviceIcon + (className ? ` ${className}`: '');

  return (
    <div className={classNames} title={serviceKey} >
      {serviceKey.substring(0, 2)}
    </div>
  );
};

export default ServiceIcon;
