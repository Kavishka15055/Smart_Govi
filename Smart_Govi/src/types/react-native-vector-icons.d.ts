declare module 'react-native-vector-icons/MaterialIcons' {
  import { Component } from 'react';
  import { TextStyle, ViewStyle } from 'react-native';

  interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle | ViewStyle;
  }

  export default class Icon extends Component<IconProps> {}
}

declare module 'firebase/auth' {
  export * from '@firebase/auth';
  import { Persistence } from '@firebase/auth';
  export function getReactNativePersistence(storage: any): Persistence;
}
