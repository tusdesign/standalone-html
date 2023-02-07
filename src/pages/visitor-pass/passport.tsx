import { FC } from 'react';
import { Visit } from './interfaces';

export const Passport:FC<{ visit: Visit, visitorName: string, isOverNight: boolean }> = ({
  visit, visitorName, isOverNight,
}) => {
  console.log(visit);
  console.log(visitorName);
  console.log(isOverNight);
  return (
    <div>passport</div>
  );
};
