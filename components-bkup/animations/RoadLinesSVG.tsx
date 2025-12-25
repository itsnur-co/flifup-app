import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RoadLinesSVGProps {
  width?: number;
  height?: number;
}

/**
 * Animated Road Lines SVG Component
 * Uses the road-line.svg design with stroke-dashoffset animation
 */
export const RoadLinesSVG: React.FC<RoadLinesSVGProps> = ({
  width = SCREEN_WIDTH,
  height = SCREEN_HEIGHT,
}) => {
  // Animation values for each path
  const path1Progress = useSharedValue(1);
  const path2Progress = useSharedValue(1);
  const path3Progress = useSharedValue(1);
  const path4Progress = useSharedValue(1);

  useEffect(() => {
    // Animate all paths with different delays
    path1Progress.value = withDelay(
      0,
      withTiming(0, {
        duration: 1500,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    );

    path2Progress.value = withDelay(
      200,
      withTiming(0, {
        duration: 1500,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    );

    path3Progress.value = withDelay(
      100,
      withTiming(0, {
        duration: 1500,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    );

    path4Progress.value = withDelay(
      300,
      withTiming(0, {
        duration: 1500,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    );
  }, []);

  // Animated props for each path
  const animatedPath1Props = useAnimatedProps(() => ({
    strokeDashoffset: path1Progress.value * 300,
  }));

  const animatedPath2Props = useAnimatedProps(() => ({
    strokeDashoffset: path2Progress.value * 300,
  }));

  const animatedPath3Props = useAnimatedProps(() => ({
    strokeDashoffset: path3Progress.value * 300,
  }));

  const animatedPath4Props = useAnimatedProps(() => ({
    strokeDashoffset: path4Progress.value * 300,
  }));

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 375 576"
      style={StyleSheet.absoluteFill}
    >
      <Defs>
        <LinearGradient id="paint0_linear" x1="349.639" y1="131.043" x2="242.323" y2="-95.1293">
          <Stop offset="0" stopColor="#7621E6" />
          <Stop offset="0.5" stopColor="#9039FF" />
          <Stop offset="1" stopColor="#A768FF" />
        </LinearGradient>
        <LinearGradient id="paint1_linear" x1="331.139" y1="100.807" x2="222.048" y2="-142.91">
          <Stop offset="0" stopColor="#7621E6" />
          <Stop offset="0.5" stopColor="#9039FF" />
          <Stop offset="1" stopColor="#A768FF" />
        </LinearGradient>
        <LinearGradient id="paint2_linear" x1="108.465" y1="560.362" x2="1.06672" y2="368.857">
          <Stop offset="0" stopColor="#7621E6" />
          <Stop offset="0.5" stopColor="#9039FF" />
          <Stop offset="1" stopColor="#A768FF" />
        </LinearGradient>
        <LinearGradient id="paint3_linear" x1="83.5026" y1="529.594" x2="-28.5093" y2="350.832">
          <Stop offset="0" stopColor="#7621E6" />
          <Stop offset="0.5" stopColor="#9039FF" />
          <Stop offset="1" stopColor="#A768FF" />
        </LinearGradient>
      </Defs>

      {/* Top Right Path 1 */}
      <AnimatedPath
        d="M246.953 211.081C244.724 191.509 260.861 143.979 343.242 110.428C425.623 76.8773 442.652 46.5883 440.869 35.6377"
        stroke="url(#paint0_linear)"
        strokeWidth="2"
        fill="none"
        strokeDasharray="300"
        animatedProps={animatedPath1Props}
      />

      {/* Top Right Path 2 */}
      <AnimatedPath
        d="M216.193 185.309C213.964 165.738 230.102 118.207 312.483 84.6567C394.864 51.1058 435.103 11.0312 433.32 0.0805664"
        stroke="url(#paint1_linear)"
        strokeWidth="2"
        fill="none"
        strokeDasharray="300"
        animatedProps={animatedPath2Props}
      />

      {/* Bottom Left Path 1 */}
      <AnimatedPath
        d="M-49.0686 575.436C-51.1689 555.75 -9.94634 497.396 67.6821 463.649C145.311 429.902 165.586 395.921 163.906 384.906"
        stroke="url(#paint2_linear)"
        strokeWidth="2"
        fill="none"
        strokeDasharray="300"
        animatedProps={animatedPath3Props}
      />

      {/* Bottom Left Path 2 */}
      <AnimatedPath
        d="M-55.8515 544.501C-57.9519 524.815 -38.3347 471.382 39.2938 437.636C116.922 403.889 134.229 367.095 132.549 356.081"
        stroke="url(#paint3_linear)"
        strokeWidth="2"
        fill="none"
        strokeDasharray="300"
        animatedProps={animatedPath4Props}
      />
    </Svg>
  );
};
