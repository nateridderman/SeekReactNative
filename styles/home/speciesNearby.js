import { StyleSheet, Platform } from "react-native";
import {
  colors,
  fonts,
  fontSize
} from "../global";

export default StyleSheet.create( {
  container: {
    flex: 1,
    backgroundColor: colors.seekForestGreen,
    height: 422
  },
  header: {
    marginTop: 21,
    marginLeft: 22
  },
  headerText: {
    fontSize: 19,
    fontFamily: fonts.semibold,
    color: colors.white,
    letterSpacing: 1.12
  },
  buttonContainer: {
    marginTop: 30,
    marginLeft: 22,
    marginBottom: 15
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 15
  },
  locationPicker: {
    paddingHorizontal: 9,
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "center"
  },
  whiteButton: {
    backgroundColor: colors.white,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 9,
    paddingRight: 9,
    height: 29
  },
  image: {
    marginRight: 13,
    width: 16,
    height: 21,
    resizeMode: "contain"
  },
  buttonText: {
    paddingTop: Platform.OS === "ios" ? 5 : 0,
    fontSize: 19,
    fontFamily: fonts.semibold,
    color: colors.seekForestGreen,
    letterSpacing: 1.12
  },
  secondButtonText: {
    fontSize: 19,
    fontFamily: fonts.semibold,
    color: colors.seekForestGreen,
    letterSpacing: 1.12
  },
  speciesNearbyContainer: {
    backgroundColor: "#2a7353",
    height: 223
  },
  taxonList: {
    marginTop: 29,
    paddingLeft: 20
  },
  gridCell: {
    width: 108,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  cellImage: {
    width: 108,
    height: 108,
    borderRadius: 108 / 2
  },
  cellTitle: {
    height: 92,
    width: 108,
    paddingTop: 15,
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  cellTitleText: {
    textAlign: "center",
    color: colors.white,
    fontFamily: fonts.default,
    lineHeight: 21,
    fontSize: 16
  },
  textContainer: {
    marginLeft: 22,
    marginRight: 22,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontFamily: fonts.default,
    fontSize: fontSize.buttonText
  },
  error: {
    backgroundColor: colors.errorGray,
    paddingTop: 32,
    paddingBottom: 32
  },
  loading: {
    paddingTop: 32,
    paddingBottom: 32
  }
} );
