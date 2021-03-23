import { StyleSheet } from "react-native";

export default () => {
  const fontSize = 22;
  return StyleSheet.create({
    mainContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    auxMainContainer: {
      flex: 1,
      width: "100%",
    },
    primaryScrollBox: {
      width: "100%",
      backgroundColor: "#0088ff",
    },
    primaryText: {
      fontSize,
      color: "#dddddd",
    },
    secondaryScrollBox: {
      backgroundColor: "#ffffff",
      alignSelf: "center",
      width: "100%",
      borderTopWidth: 1,
      borderBottomWidth: 1,
    },
    secondaryText: {
      fontSize,
      color: "#4a4a4a",
    },
  });
};
