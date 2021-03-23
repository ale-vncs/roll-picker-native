import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewStyle,
  TextStyle,
} from "react-native";
import useStyles from "./styles";

export interface RollPickerNativeProps {
  items: string[];
  label?: string;
  labelStyle?: TextStyle;
  index?: number;

  onIndexChange?(index: number): void;

  containerStyle?: {
    height?: number;
    textColor?: TextStyle["color"];
    fontSize?: number;
  } & Pick<ViewStyle, "backgroundColor">;
  selectStyle?: {
    height?: number;
    borderWidth?: number;
    textColor?: TextStyle["color"];
    fontSize?: number;
  } & Pick<ViewStyle, "backgroundColor">;
  lineColor?: string;
  removeLine?: boolean;
}

const RollPickerNative = ({
  items,
  selectStyle,
  containerStyle,
  removeLine = false,
  ...props
}: RollPickerNativeProps) => {
  const classes = useStyles();
  const defaultItemHeight = 20;
  const defaultTimeOutFix = 600;
  let intervalFix: NodeJS.Timeout | null = null;

  const primaryScrollRef = useRef<ScrollView>(null);
  const secondaryScrollRef = useRef<ScrollView>(null);

  const [selectHeight, setSelectHeight] = useState(defaultItemHeight);
  const [containerHeight, setContainerHeight] = useState(200);
  const [auxContainerHeight, setAuxContainerHeight] = useState(
    (containerHeight - selectHeight) / 2
  );

  useEffect(() => {
    if (props.index) {
      selectTo(props.index);
    }
    let defaultSelectHeight = selectHeight;
    let defaultContainerHeight = containerHeight;
    if (selectStyle) {
      if (selectStyle.height && selectStyle.height > defaultItemHeight) {
        setSelectHeight(selectStyle.height);
        defaultSelectHeight = selectStyle.height;
      }
    }
    if (containerStyle) {
      if (containerStyle.height) {
        setContainerHeight(containerStyle.height);
        defaultContainerHeight = containerStyle.height;
      }
    }
    setAuxContainerHeight((defaultContainerHeight - defaultSelectHeight) / 2);
  }, [props, selectStyle, containerStyle]);

  const getItem = (isPrimary: boolean) => {
    if (items.length === 0) {
      return null;
    }
    const secondaryStyle: TextStyle = {
      fontSize: selectStyle?.fontSize || classes.secondaryText.fontSize,
      color: selectStyle?.textColor || classes.secondaryText.color,
    };
    const primaryStyle: TextStyle = {
      fontSize: containerStyle?.fontSize || classes.primaryText.fontSize,
      color: containerStyle?.textColor || classes.primaryText.color,
    };
    return items.map((item, i) => {
      return (
        <View
          key={i}
          style={{
            height: selectHeight,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={isPrimary ? primaryStyle : secondaryStyle}>{item}</Text>
        </View>
      );
    });
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (intervalFix) clearInterval(intervalFix);
    const y = e.nativeEvent.contentOffset.y;
    if (secondaryScrollRef && secondaryScrollRef.current) {
      secondaryScrollRef.current.scrollTo({ y, animated: false });
    }
  };

  const onScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = Math.round(event.nativeEvent.contentOffset.y);
      const index = y / selectHeight;
      if (props.onIndexChange) props.onIndexChange(index);
      if (intervalFix) clearInterval(intervalFix);
      intervalFix = setTimeout(() => selectTo(index), defaultTimeOutFix);
    },
    [selectHeight]
  );

  const selectTo = (index: number) => {
    const y = index * selectHeight;
    if (primaryScrollRef && primaryScrollRef.current) {
      primaryScrollRef.current.scrollTo({ y, animated: false });
    }
  };

  return (
    <View style={[classes.mainContainer, { height: containerHeight }]}>
      {props.label && (
        <Text style={[{ fontSize: 22 }, props.labelStyle]}>{props.label}</Text>
      )}
      <View style={classes.auxMainContainer}>
        <View
          style={[
            classes.primaryScrollBox,
            containerStyle,
            {
              height: containerHeight,
            },
          ]}
        >
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            onScrollEndDrag={onScrollEnd}
            onMomentumScrollEnd={onScrollEnd}
            ref={primaryScrollRef}
            decelerationRate={0.5}
            scrollEventThrottle={16}
            snapToInterval={selectHeight}
            snapToAlignment={"center"}
            snapToOffsets={items.map((item, index) => selectHeight * index)}
          >
            <View style={{ height: auxContainerHeight }} />
            {getItem(true)}
            <View style={{ height: auxContainerHeight }} />
          </ScrollView>
        </View>
        <View
          style={[
            classes.secondaryScrollBox,
            selectStyle,
            {
              borderColor: props.lineColor || "white",
              height: selectHeight,
              marginTop: -(containerHeight / 2 + selectHeight / 2),
              ...(removeLine && {
                borderBottomWidth: 0,
                borderTopWidth: 0,
              }),
            },
          ]}
          pointerEvents="none"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={secondaryScrollRef}
            scrollEnabled={false}
            scrollEventThrottle={16}
          >
            {getItem(false)}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default RollPickerNative;
