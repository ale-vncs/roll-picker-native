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
  index: number;

  onIndexChange?(index: number): void;

  containerHeight?: number;
  selectHeight?: number;
  itemStyle?: ViewStyle;
  itemTextStyle?: TextStyle;
  containerStyle?: ViewStyle;
  selectStyle?: ViewStyle;
  selectTextStyle?: TextStyle;
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
  const defaultTimeOutFix = 380;
  const intervalFix = useRef<NodeJS.Timeout>();

  const primaryScrollRef = useRef<ScrollView>(null);
  const secondaryScrollRef = useRef<ScrollView>(null);

  const [selectHeight, setSelectHeight] = useState(props.selectHeight || 20);
  const [containerHeight, setContainerHeight] = useState(
    props.containerHeight || 200
  );
  const [auxContainerHeight, setAuxContainerHeight] = useState(
    (containerHeight - selectHeight) / 2
  );

  useEffect(() => {
    console.log("re-render", props, selectStyle, containerStyle);
    const defaultSelectHeight = props.selectHeight || 20;
    const defaultContainerHeight = props.containerHeight || 200;
    setSelectHeight(defaultSelectHeight);
    setContainerHeight(defaultContainerHeight);
    setAuxContainerHeight((defaultContainerHeight - defaultSelectHeight) / 2);
  }, [props.selectHeight, props.containerHeight]);

  useEffect(() => {
    selectTo(props.index);
  }, [selectHeight, containerHeight]);

  const getItem = (isPrimary: boolean) => {
    if (items.length === 0) {
      return null;
    }
    const primaryTextStyle: TextStyle = {
      fontSize: classes.primaryText.fontSize,
      color: classes.primaryText.color,
      ...(props.itemTextStyle && props.itemTextStyle),
    };
    const secondaryTextStyle: TextStyle = {
      fontSize: classes.secondaryText.fontSize,
      color: classes.secondaryText.color,
      ...(props.selectTextStyle && props.selectTextStyle),
    };
    return items.map((item, i) => {
      return (
        <View
          key={i}
          style={[
            {
              justifyContent: "center",
              alignItems: "center",
            },
            isPrimary && props.itemStyle,
            {
              height: selectHeight,
            },
          ]}
        >
          <Text style={isPrimary ? primaryTextStyle : secondaryTextStyle}>
            {item}
          </Text>
        </View>
      );
    });
  };

  const checkIntervalFix = () => {
    if (intervalFix && intervalFix.current) clearInterval(intervalFix.current);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    checkIntervalFix();
    const y = e.nativeEvent.contentOffset.y;
    if (secondaryScrollRef && secondaryScrollRef.current) {
      secondaryScrollRef.current.scrollTo({ y, animated: false });
    }
  };

  const selectTo = (index: number) => {
    const y = index * selectHeight;
    if (primaryScrollRef && primaryScrollRef.current) {
      primaryScrollRef.current.scrollTo({ y, animated: false });
    }
  };

  const onScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = Math.round(event.nativeEvent.contentOffset.y);
      const currentIndex = Math.round(y / selectHeight);
      checkIntervalFix();
      intervalFix.current = setTimeout(() => {
        if (props.onIndexChange) props.onIndexChange(currentIndex);
      }, defaultTimeOutFix);
    },
    [intervalFix.current, selectHeight]
  );

  return (
    <View style={[classes.mainContainer, { height: containerHeight }]}>
      {props.label && (
        <Text style={[{ fontSize: 20 }, props.labelStyle]}>{props.label}</Text>
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
            ref={primaryScrollRef}
            decelerationRate={0.5}
            scrollEventThrottle={16}
            snapToInterval={selectHeight}
            nestedScrollEnabled={false}
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
            {
              position: "absolute",
              flex: 1,
              width: "100%",
              backgroundColor:
                containerStyle?.backgroundColor ||
                classes.primaryScrollBox.backgroundColor,
              height: selectHeight,
              top: containerHeight / 2 - selectHeight / 2,
            },
          ]}
        />
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
            onScroll={onScrollEnd}
          >
            {getItem(false)}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default RollPickerNative;
