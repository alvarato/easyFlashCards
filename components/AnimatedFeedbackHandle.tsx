import { forwardRef, useImperativeHandle, useRef } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

export type AnimatedFeedbackHandle = {
  shake: () => void;
  success: () => void;
};

type AnimatedFeedbackProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const AnimatedFeedback = forwardRef<
  AnimatedFeedbackHandle,
  AnimatedFeedbackProps
>(({ children, style }, ref) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useImperativeHandle(ref, () => ({
    shake: () => {
      shakeAnim.setValue(0);
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    },
    success: () => {
      scaleAnim.setValue(1);
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.08,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    },
  }));

  const translateX = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-8, 8],
  });

  return (
    <Animated.View
      style={[style, { transform: [{ translateX }, { scale: scaleAnim }] }]}
    >
      {children}
    </Animated.View>
  );
});

export default AnimatedFeedback;
