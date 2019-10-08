// @flow

import React, { Component } from "react";
import {
  View,
  Text
} from "react-native";
import jwt from "react-native-jwt-io";

import config from "../../config";
import i18n from "../../i18n";
import styles from "../../styles/signup/signup";
import GreenHeader from "../UIComponents/GreenHeader";
import GreenButton from "../UIComponents/GreenButton";
import SafeAreaView from "../UIComponents/SafeAreaView";
import ErrorMessage from "./ErrorMessage";
import LoadingWheel from "../UIComponents/LoadingWheel";
import GreenText from "../UIComponents/GreenText";
import InputField from "../UIComponents/InputField";
import { checkIsEmailValid } from "../../utility/loginHelpers";

type Props = {
  +navigation: any
}

class ParentalConsentScreen extends Component<Props> {
  constructor() {
    super();

    this.state = {
      email: "",
      error: false,
      loading: false
    };
  }

  setError( error ) {
    this.setState( { error } );
  }

  setLoading( loading ) {
    this.setState( { loading } );
  }

  createJwtToken() {
    const claims = {
      application: "SeekRN",
      exp: new Date().getTime() / 1000 + 300
    };

    const token = jwt.encode( claims, config.jwtSecret, "HS512" );
    return token;
  }

  shareEmailWithiNat() {
    const { email } = this.state;

    this.setLoading( true );
    const token = this.createJwtToken();

    const params = {
      email
    };

    const headers = {
      "Content-Type": "application/json"
    };

    if ( token ) {
      headers.Authorization = `Authorization: ${token}`;
    }

    const site = "https://www.inaturalist.org";

    fetch( `${site}/users/parental_consent`, {
      method: "POST",
      body: JSON.stringify( params ),
      headers
    } )
      .then( ( responseJson ) => {
        const { status } = responseJson;
        if ( status === 200 || status === 404 ) {
          this.setLoading( false );
          this.submit();
        }
      } ).catch( ( err ) => {
        this.setError( err );
        this.setLoading( false );
      } );
  }

  submit() {
    const { navigation } = this.props;
    navigation.navigate( "ParentCheckEmail" );
  }

  render() {
    const { navigation } = this.props;
    const { email, error, loading } = this.state;

    return (
      <View style={styles.container}>
        <SafeAreaView />
        <GreenHeader header={i18n.t( "login.sign_up" )} navigation={navigation} />
        <View style={styles.margin} />
        <Text style={styles.header}>
          {i18n.t( "inat_signup.enter_email" )}
        </Text>
        <Text style={[styles.text, styles.keyboardText]}>
          {i18n.t( "inat_signup.under_13" )}
        </Text>
        <View style={styles.margin} />
        <View style={styles.leftTextMargins}>
          <GreenText smaller text={i18n.t( "inat_signup.parent_email" ).toLocaleUpperCase()} />
        </View>
        <InputField
          handleTextChange={value => this.setState( { email: value } )}
          placeholder="email"
          text={email}
          type="emailAddress"
        />
        <View style={styles.center}>
          {loading ? <LoadingWheel /> : null}
          {error ? <ErrorMessage error={error} /> : <View style={styles.greenButtonMargin} />}
        </View>
        <GreenButton
          handlePress={() => {
            if ( checkIsEmailValid( email ) ) {
              this.setError( false );
              this.shareEmailWithiNat();
            } else {
              this.setError( "email" );
            }
          }}
          login
          text={i18n.t( "inat_signup.submit" ).toLocaleUpperCase()}
        />
      </View>
    );
  }
}

export default ParentalConsentScreen;
