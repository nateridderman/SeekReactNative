import { StyleSheet, Dimensions } from "react-native";
import {
  colors,
  fonts,
  padding,
  touchable
} from "./global";

const { width, height } = Dimensions.get( "window" );

export default StyleSheet.create( {
  backButton: {
    left: 23,
    top: 18
  },
  buttonText: {
    color: colors.white,
    fontFamily: fonts.semibold,
    fontSize: 18,
    letterSpacing: 1.0,
    paddingTop: padding.iOSPadding
  },
  caption: {
    marginBottom: 20,
    marginTop: 20,
    textAlign: "center",
    width: 245
  },
  center: {
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    backgroundColor: colors.white,
    flex: 1
  },
  explainImage: {
    marginBottom: 33,
    resizeMode: "contain",
    width: width - 56
  },
  forestGreenText: {
    color: colors.seekForestGreen,
    fontFamily: fonts.semibold,
    fontSize: 18,
    letterSpacing: 1.0,
    lineHeight: 24,
    marginBottom: 7
  },
  greenButton: {
    alignItems: "center",
    backgroundColor: colors.seekForestGreen,
    borderRadius: 34,
    height: 52,
    justifyContent: "center",
    width: height < 570 ? 292 : 317
  },
  header: {
    backgroundColor: colors.white,
    height: 55,
    marginBottom: 30
  },
  heatMap: {
    height: 227,
    overflow: "hidden",
    resizeMode: "cover",
    width
  },
  iNatLogo: {
    height: height > 570 ? 65 : 45,
    position: "absolute",
    resizeMode: "contain",
    right: -5,
    top: 5,
    width: height > 570 ? 81 : 61
  },
  image: {
    height: 286,
    resizeMode: "cover",
    width
  },
  italicText: {
    color: colors.black,
    fontFamily: fonts.bookItalic,
    fontSize: 16,
    lineHeight: 21,
    marginHorizontal: 27,
    marginTop: 33,
    textAlign: "center"
  },
  leftArrow: {
    left: 5,
    position: "absolute",
    top: 137,
    zIndex: 1
  },
  logo: {
    alignSelf: "center",
    height: 34,
    resizeMode: "contain",
    width: 175
  },
  missionContainer: {
    alignItems: "flex-start",
    backgroundColor: colors.white,
    marginBottom: 46,
    marginHorizontal: 27,
    marginTop: 21
  },
  missionHeaderText: {
    color: colors.black,
    fontFamily: fonts.semibold,
    fontSize: 19,
    lineHeight: 24,
    marginBottom: 10
  },
  missionText: {
    color: colors.black,
    fontFamily: fonts.book,
    fontSize: 16,
    lineHeight: 21
  },
  numberText: {
    color: colors.black,
    fontFamily: fonts.light,
    fontSize: 30,
    marginBottom: 23
  },
  photoContainer: {
    height: 350
  },
  rightArrow: {
    position: "absolute",
    right: 5,
    top: 137,
    zIndex: 1
  },
  safeView: {
    backgroundColor: colors.transparent,
    flex: 1
  },
  touchable
} );
