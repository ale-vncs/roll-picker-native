import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewStyle,
  TextStyle,
  NativeScrollPoint,
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
  itemStyle?: Omit<ViewStyle, "height">;
  itemTextStyle?: TextStyle;
  containerStyle?: Omit<ViewStyle, "height">;
  selectStyle?: Omit<ViewStyle, "height">;
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

  const getScrollIndex = (scrollY: NativeScrollPoint["y"]) => {
    const y = Math.round(scrollY);
    return Math.round(y / selectHeight);
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
      checkIntervalFix();
      const currentIndex = getScrollIndex(event.nativeEvent.contentOffset.y);
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
          <View
            style={{
              position: "absolute",
              height: removeLine ? selectHeight : selectHeight - 2,
              width: "100%",
              backgroundColor:
                containerStyle?.backgroundColor ||
                classes.primaryScrollBox.backgroundColor,
            }}
          >
            <View
              style={{
                flex: 1,
                width: "100%",
                backgroundColor:
                  selectStyle?.backgroundColor ||
                  classes.secondaryScrollBox.backgroundColor,
              }}
            />
          </View>
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
