import { NativeModules } from 'react-native';

const { BrightnessModule } = NativeModules;

export const requestPermission = () => {
  return new Promise((resolve) => {
    BrightnessModule.canWriteSettings((granted) => {
      if (!granted) {
        BrightnessModule.requestWriteSettings();
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

export const setBrightness = (value) => {
  BrightnessModule.setBrightness(value);
};

export const getBrightness = () => {
  return new Promise((resolve) => {
    BrightnessModule.getBrightness((value) => {
      resolve(value);
    });
  });
};