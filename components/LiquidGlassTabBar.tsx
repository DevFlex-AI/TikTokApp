import { colors } from '@/constants/colors';
import { BlurView } from 'expo-blur';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

interface LiquidGlassTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const LiquidGlassTabBar: React.FC<LiquidGlassTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const translateX = useSharedValue(0);
  const tabWidth = 100 / state.routes.length;

  useEffect(() => {
    translateX.value = withSpring(state.index * tabWidth, {
      damping: 20,
      stiffness: 90,
    });
  }, [state.index]);

  const liquidBlobStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(
            (translateX.value / 100) * (Platform.OS === 'web' ? 400 : 375),
            {
              damping: 15,
              stiffness: 80,
            }
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="light" style={styles.blurContainer}>
        <View style={styles.tabBarContainer}>
          <Animated.View style={[styles.liquidBlob, liquidBlobStyle]} />

          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TabBarItem
                key={route.key}
                isFocused={isFocused}
                options={options}
                onPress={onPress}
                onLongPress={onLongPress}
              />
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

interface TabBarItemProps {
  isFocused: boolean;
  options: any;
  onPress: () => void;
  onLongPress: () => void;
}

const TabBarItem: React.FC<TabBarItemProps> = ({
  isFocused,
  options,
  onPress,
  onLongPress,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(isFocused ? 1 : 0.6);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.15 : 1, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(isFocused ? 1 : 0.6, { duration: 200 });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const iconColor = isFocused ? colors.primary : colors.black;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabItem}
    >
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        {options.tabBarIcon && options.tabBarIcon({
          size: 24,
          color: iconColor
        })}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 55,
    overflow: 'hidden',
  },
  blurContainer: {
    flex: 1,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  tabBarContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  liquidBlob: {
    position: 'absolute',
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: 'rgba(254, 44, 85, 0.15)',
    top: -10,
    left: 0,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LiquidGlassTabBar;
