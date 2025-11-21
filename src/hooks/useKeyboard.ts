import { useEffect, useState } from 'react';
import { Keyboard, KeyboardInfo } from '@capacitor/keyboard';
import { isNativePlatform } from '../utils/native';

/**
 * Hook to manage keyboard state and behavior
 */
export const useKeyboard = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!isNativePlatform()) return;

    let willShowListener: any;
    let didShowListener: any;
    let willHideListener: any;
    let didHideListener: any;

    const setupListeners = async () => {
      // Keyboard will show
      willShowListener = await Keyboard.addListener('keyboardWillShow', (info: KeyboardInfo) => {
        setKeyboardHeight(info.keyboardHeight);
      });

      // Keyboard did show
      didShowListener = await Keyboard.addListener('keyboardDidShow', (info: KeyboardInfo) => {
        setIsKeyboardVisible(true);
        setKeyboardHeight(info.keyboardHeight);
      });

      // Keyboard will hide
      willHideListener = await Keyboard.addListener('keyboardWillHide', () => {
        setKeyboardHeight(0);
      });

      // Keyboard did hide
      didHideListener = await Keyboard.addListener('keyboardDidHide', () => {
        setIsKeyboardVisible(false);
        setKeyboardHeight(0);
      });
    };

    setupListeners();

    return () => {
      willShowListener?.remove();
      didShowListener?.remove();
      willHideListener?.remove();
      didHideListener?.remove();
    };
  }, []);

  const hideKeyboard = async () => {
    if (isNativePlatform()) {
      await Keyboard.hide();
    }
  };

  const showKeyboard = async () => {
    if (isNativePlatform()) {
      await Keyboard.show();
    }
  };

  return {
    isKeyboardVisible,
    keyboardHeight,
    hideKeyboard,
    showKeyboard
  };
};
