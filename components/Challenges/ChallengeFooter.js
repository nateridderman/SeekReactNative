// @flow

import React from "react";
import { View, TouchableOpacity, Image } from "react-native";

import styles from "../../styles/home/footer";
import icons from "../../assets/icons";
import logos from "../../assets/logos";

type Props = {
  navigation: any
}

const Footer = ( {
  navigation
}: Props ) => (
  <View style={styles.container}>
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate( "Menu" )}
      >
        <Image source={icons.hamburger} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.push( "Camera", {
        id: null,
        commonName: null
      } )}
      >
        <Image source={icons.cameraGreen} style={styles.cameraImage} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.push( "iNatStats" )}
      >
        <Image source={logos.bird} style={{ width: 36, height: 29, resizeMode: "contain" }} />
      </TouchableOpacity>
    </View>
  </View>
);

export default Footer;