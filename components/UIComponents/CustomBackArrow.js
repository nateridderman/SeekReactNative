// @flow

import React from "react";
import {
  TouchableOpacity,
  Image
} from "react-native";

import styles from "../../styles/uiComponents/backArrow";
import icons from "../../assets/icons";
import i18n from "../../i18n";

type Props = {
  +navigation: any,
  +route: string
}

const CustomBackArrow = ( { navigation, route }: Props ) => (
  <TouchableOpacity
    accessibilityLabel={i18n.t( "accessibility.tap" )}
    accessible
    hitSlop={styles.touchable}
    onPress={() => navigation.navigate( route )}
    style={styles.backButton}
  >
    <Image source={icons.backButton} />
  </TouchableOpacity>
);

export default CustomBackArrow;
