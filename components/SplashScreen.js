// @flow

import React, { Component } from "react";
import {
  Image,
  ImageBackground,
  Text,
  View,
  Platform
} from "react-native";

import i18n from "../i18n";
import styles from "../styles/splash";
import logoImages from "../assets/logos";
import backgrounds from "../assets/backgrounds";
import { checkIfFirstLaunch, setCameraLaunched } from "../utility/helpers";
import { checkIfFirstLogin } from "../utility/loginHelpers";

type Props = {
  +navigation: any
}

class SplashScreen extends Component<Props> {
  constructor() {
    super();

    this.state = {
      isFirstLaunch: false,
      hasCheckedAsyncStorage: false
    };
  }

  async componentDidMount() {
    setCameraLaunched( false );
    const isFirstLaunch = await checkIfFirstLaunch();
    const isFirstLogin = await checkIfFirstLogin();
    this.setState( {
      isFirstLaunch,
      isFirstLogin,
      hasCheckedAsyncStorage: true
    }, () => this.transitionScreen() );
  }

  transitionScreen() {
    const { isFirstLaunch, isFirstLogin, hasCheckedAsyncStorage } = this.state;

    const splashTimer = Platform.OS === "android" ? 2000 : 3000;

    if ( !hasCheckedAsyncStorage ) {
      return null;
    }

    if ( isFirstLaunch ) {
      setTimeout( () => this.resetRouter( "Onboarding" ), splashTimer );
    } else if ( isFirstLogin ) {
      setTimeout( () => this.resetRouter( "Login" ), splashTimer );
    } else {
      setTimeout( () => this.resetRouter( "Main" ), splashTimer );
    }
    return null;
  }

  resetRouter( routeName ) {
    const { navigation } = this.props;

    navigation.navigate( { routeName } );
  }

  render() {
    return (
      <ImageBackground
        source={backgrounds.splash}
        style={styles.backgroundImage}
      >
        <View style={styles.center}>
          <View style={styles.banner}>
            <Image source={logoImages.wwfop} style={styles.image} />
          </View>
          <Text style={styles.headerText}>{i18n.t( "splash.presents" ).toLocaleUpperCase()}</Text>
        </View>
        <Image
          source={logoImages.seek}
          style={styles.logo}
        />
        <Text style={styles.text}>{i18n.t( "splash.initiative" )}</Text>
      </ImageBackground>
    );
  }
}

export default SplashScreen;
