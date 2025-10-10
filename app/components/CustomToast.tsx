import {
  AlertCircleIcon,
  CancelCircleIcon,
  Tick04Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface CustomToastProps {
  visible: boolean;
  message: string;
  type: "success" | "error" | "info";
  onHide: () => void;
  duration?: number;
}

const CustomToast: React.FC<CustomToastProps> = ({
  visible,
  message,
  type,
  onHide,
  duration = 3000,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  const getToastStyle = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getIcon = (type: any) => {
    switch (type) {
      case "success":
        return <HugeiconsIcon icon={Tick04Icon} color={"white"} />;
      case "error":
        return <HugeiconsIcon icon={CancelCircleIcon} color={"white"} />;
      case "info":
        return <HugeiconsIcon icon={AlertCircleIcon} color={"white"} />;
      default:
        return <HugeiconsIcon icon={AlertCircleIcon} color={"white"} />;
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 50,
        left: 20,
        right: 20,
        zIndex: 1000,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <TouchableOpacity
        onPress={hideToast}
        className={`${getToastStyle()} rounded-xl p-4 flex-row items-center shadow-lg`}
      >
        <View className="bg-white/20 rounded-full p-2 mr-3">
          <Text className="text-white text-lg font-bold size-6 text-center">
            {getIcon(type)}
          </Text>
        </View>
        <Text className="text-white font-semibold flex-1 text-base">
          {message}
        </Text>
        <TouchableOpacity onPress={hideToast} className="ml-2">
          <HugeiconsIcon icon={CancelCircleIcon} color={"white"} size={32} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CustomToast;
