import React, { Component } from 'react';
import { Animated, Easing, Platform } from 'react-native';
import BaseScreen from './BaseScreen';
import SlideFromRightScreen from './SlideFromRightScreen';
import CollapseExpandScreen from './CollapseExpandScreen';
import { createStackNavigator, createAppContainer } from 'react-navigation';

let SlideFromRight = (index, position, width) => {
  const translateX = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: [width, 0],
  })

  return { transform: [ { translateX } ] }
};

let SlideFromBottom = (index, position, height) => {
  const translateY = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: [height, 0],
  })

  return { transform: [ { translateY } ] }
};

let CollapseTransition = (index, position) => {
  const opacity = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [0, 1, 1]
  });

  const scaleY = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [0, 1, 1]
  });

  return {
    opacity,
    transform: [ { scaleY } ]
  }
}

const TransitionConfiguration = () => {
  return {
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: (sceneProps) => {
      const { layout, position, scene } = sceneProps;
      const width = layout.initWidth;
      const height = layout.initHeight;
      const { index, route } = scene
      const params = route.params || {}; // <- That's new
      const transition = params.transition || 'default'; // <- That's new
      return {
        default: SlideFromRight(index, position, width),
        bottomTransition: SlideFromBottom(index, position, height),
        collapseTransition: CollapseTransition(index, position)
      }[transition];
    },
  }
}

const RootStack = createStackNavigator({
  SlideFromRight: { screen: SlideFromRightScreen },
  SlideFromBottom: { screen: SlideFromRightScreen },
  Base: { screen: BaseScreen },
  CollapseExpand: { screen: CollapseExpandScreen }
}, {
    initialRouteName: 'Base',
    headerMode: 'screen',
    transitionConfig: TransitionConfiguration,
});

// export default TransitionApp
const AppContainer = createAppContainer(RootStack);
  
  export default class TransitionApp extends Component {
    render() {
      return <AppContainer />;
    }
  }