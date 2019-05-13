// @flow

import React, { Component } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Modal,
  Alert
} from "react-native";
import { NavigationEvents } from "react-navigation";
import Geocoder from "react-native-geocoder";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import inatjs, { FileUpload } from "inaturalistjs";

import styles from "../../styles/posting/postToiNat";
import { getLatAndLng } from "../../utility/locationHelpers";
import { fetchAccessToken } from "../../utility/loginHelpers";
import GreenHeader from "../GreenHeader";
import i18n from "../../i18n";
import posting from "../../assets/posting";
import LocationPicker from "./LocationPicker";
import GeoprivacyPicker from "./GeoprivacyPicker";
import CaptivePicker from "./CaptivePicker";

type Props = {
  navigation: any
};

class PostScreen extends Component<Props> {
  constructor( { navigation }: Props ) {
    super();

    const {
      taxaName,
      taxaId,
      userImage,
      scientificName
    } = navigation.state.params;

    this.state = {
      latitude: null,
      longitude: null,
      location: null,
      date: moment().format( "YYYY-MM-DD" ),
      captive: null,
      geoprivacy: null,
      taxon: {
        preferredCommonName: taxaName || i18n.t( "posting.unknown" ),
        name: scientificName,
        taxaId,
        userImage
      },
      modalVisible: false,
      isDateTimePickerVisible: false,
      error: null
    };

    this.updateGeoprivacy = this.updateGeoprivacy.bind( this );
    this.updateCaptive = this.updateCaptive.bind( this );
    this.updateLocation = this.updateLocation.bind( this );
    this.toggleLocationPicker = this.toggleLocationPicker.bind( this );
  }

  async getLocation() {
    const { latitude, longitude } = this.state;
    if ( !latitude || !longitude ) {
      const location = await getLatAndLng();
      this.reverseGeocodeLocation( location.latitude, location.longitude );
      this.setLatitude( location.latitude );
      this.setLongitude( location.longitude );
    }
  }

  async getToken() {
    const token = await fetchAccessToken();
    if ( token ) {
      this.fetchJSONWebToken( token );
    }
  }

  setLatitude( latitude ) {
    this.setState( { latitude } );
  }

  setLongitude( longitude ) {
    this.setState( { longitude } );
  }

  setLocationUndefined() {
    this.setState( { location: i18n.t( "location_picker.undefined" ) } );
  }

  setLocation( location ) {
    this.setState( { location } );
  }

  showDateTimePicker = () => {
    this.setState( { isDateTimePickerVisible: true } );
  };

  hideDateTimePicker = () => {
    this.setState( { isDateTimePickerVisible: false } );
  };

  handleDatePicked = ( date ) => {
    if ( date ) {
      this.setState( {
        date: date.toString()
      }, this.hideDateTimePicker() );
    }
  };

  toggleLocationPicker() {
    const { modalVisible, error } = this.state;

    if ( !error ) {
      this.setState( {
        modalVisible: !modalVisible
      } );
    }
  }

  updateLocation( latitude, longitude, location ) {
    this.setState( {
      latitude,
      longitude,
      location
    }, () => this.toggleLocationPicker() );
  }

  updateGeoprivacy( geoprivacy ) {
    this.setState( { geoprivacy } );
  }

  updateCaptive( captive ) {
    this.setState( { captive } );
  }

  reverseGeocodeLocation( lat, lng ) {
    Geocoder.geocodePosition( { lat, lng } ).then( ( result ) => {
      const { locality, subAdminArea } = result[0];
      this.setLocation( locality || subAdminArea );
    } ).catch( () => {
      console.log( "couldn't geocode location" );
    } );
  }

  setError() {
    Alert.alert( "error" );
  }

  setUnauthorized() {
    Alert.alert( "user is not logged in" );
  }

  fetchJSONWebToken( token ) {
    const headers = {
      "Content-Type": "application/json"
    };

    const site = "https://staging.inaturalist.org";
    // const site = "https://www.inaturalist.org";

    if ( token ) {
      headers.Authorization = `Bearer ${token}`;
    }

    fetch( `${site}/users/api_token`, { headers } )
      .then( response => response.json() )
      .then( ( responseJson ) => {
        const { api_token } = responseJson;
        this.createObservation( api_token );
      } ).catch( () => {
        this.setUnauthorized();
      } );
  }

  createObservation( token ) {
    const {
      geoprivacy,
      captive,
      location,
      date,
      taxon,
      latitude,
      longitude
    } = this.state;

    const params = {
      observation: {
        species_guess: taxon.preferredCommonName,
        observed_on_string: date,
        taxon_id: taxon.taxaId,
        geoprivacy,
        captive,
        place_guess: location,
        latitude, // use the non-truncated version
        longitude, // use the non-truncated version
        owners_identification_from_vision_requested: true // this shows that the id is recommended by computer vision
      }
    };

    const options = { api_token: token, user_agent: "Seek" };

    inatjs.setConfig( { apiURL: "https://stagingapi.inaturalist.org/v1" } );

    inatjs.observations.create( params, options ).then( ( response ) => {
      const { id } = response;
      this.addPhotoToObservation( id, token ); // get the obs id, then add photo
    } ).catch( ( error ) => {
      Alert.alert( JSON.stringify( error ) );
    } );
  }

  addPhotoToObservation( obsId, token ) {
    const {
      taxon,
      latitude,
      longitude,
      date
    } = this.state;
    const { userImage } = taxon;

    const photoParams = {
      image: new FileUpload( {
        uri: userImage,
        name: "photo.jpeg",
        type: "image/jpeg"
      } ),
      observed_on: date,
      latitude,
      longitude
    };

    const options = { api_token: token, user_agent: "Seek" };

    inatjs.setConfig( { apiURL: "https://stagingapi.inaturalist.org/v1" } );

    const params = {
      observation_photo: {
        observation_id: obsId
      },
      file: photoParams
    };

    inatjs.observation_photos.create( params, options ).then( ( response ) => {
      Alert.alert( JSON.stringify( response ) );
    } ).catch( ( error ) => {
      Alert.alert( JSON.stringify( error ), "error uploading photo" );
    } );
  }


  render() {
    const { navigation } = this.props;
    const {
      taxon,
      date,
      location,
      latitude,
      longitude,
      modalVisible,
      isDateTimePickerVisible
    } = this.state;

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeViewTop} />
        <SafeAreaView style={styles.safeView}>
          <DateTimePicker
            isVisible={isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            mode="datetime"
            maximumDate={new Date()}
            hideTitleContainerIOS
            datePickerModeAndroid="spinner"
            timePickerModeAndroid="spinner"
          />
          <Modal
            visible={modalVisible}
            onRequestClose={() => this.toggleLocationPicker()}
          >
            <LocationPicker
              latitude={latitude}
              longitude={longitude}
              location={location}
              updateLocation={this.updateLocation}
              toggleLocationPicker={this.toggleLocationPicker}
            />
          </Modal>
          <NavigationEvents
            onWillFocus={() => {
              this.getLocation();
            }}
          />
          <GreenHeader
            navigation={navigation}
            header={i18n.t( "posting.header" )}
          />
          <View style={styles.textContainer}>
            <View style={styles.card}>
              <Image style={styles.image} source={{ uri: taxon.userImage }} />
              <View style={styles.speciesNameContainer}>
                <Text style={styles.commonNameText}>
                  {taxon.preferredCommonName ? taxon.preferredCommonName : taxon.name}
                </Text>
                {taxon.name ? <Text style={styles.text}>{taxon.name}</Text> : null}
              </View>
            </View>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.thinCard}
            onPress={() => this.showDateTimePicker()}
          >
            <Image style={styles.icon} source={posting.date} />
            <View style={styles.row}>
              <Text style={styles.greenText}>
                {i18n.t( "posting.date" ).toLocaleUpperCase()}
              </Text>
              <Text style={styles.text}>
                {date}
              </Text>
            </View>
            <Image style={styles.buttonIcon} source={posting.expand} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.thinCard}
            onPress={() => this.toggleLocationPicker()}
          >
            <Image style={[styles.icon, { marginHorizontal: 5 }]} source={posting.location} />
            <View style={styles.row}>
              <Text style={styles.greenText}>
                {i18n.t( "posting.location" ).toLocaleUpperCase()}
              </Text>
              <Text style={styles.text}>
                {location}
              </Text>
            </View>
            <Image style={styles.buttonIcon} source={posting.expand} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <GeoprivacyPicker updateGeoprivacy={this.updateGeoprivacy} />
          <View style={styles.divider} />
          <CaptivePicker updateCaptive={this.updateCaptive} />
          <View style={styles.divider} />
          <View style={styles.textContainer}>
            <TouchableOpacity
              style={styles.greenButton}
              onPress={() => this.getToken()}
            >
              <Text style={styles.buttonText}>
                {i18n.t( "posting.header" ).toLocaleUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

export default PostScreen;
