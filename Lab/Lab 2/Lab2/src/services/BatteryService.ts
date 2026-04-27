import { NativeModules } from 'react-native';

const { BatteryModule } = NativeModules;

export const getBatteryLevel = () => {
  return new Promise((resolve) => {
    BatteryModule.getBatteryLevel((level : any) => {
      resolve(level);
    });
  });
};