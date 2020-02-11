import i18n from "../i18n";

const Realm = require( "realm" );
const realmConfig = require( "../models/index" );


const addCommonNamesFromFile = ( realm, commonNamesDict ) => {
  const searchLocale = i18n.currentLocale( ).split( "-" )[0].toLowerCase( );

  commonNamesDict.forEach( ( commonNameRow, i ) => {
    if ( searchLocale === commonNameRow.l ) {
      // console.log( searchLocale === commonNameRow.l, "adding common name for this locale: ", i );
      realm.create( "CommonNamesRealm", {
        taxon_id: commonNameRow.i,
        locale: commonNameRow.l,
        name: commonNameRow.n
      }, true );
    }
  } );
};

const setupCommonNames = () => {
  Realm.open( realmConfig.default )
    .then( ( realm ) => {
      realm.write( () => {
        // check to see if names are already in Realm. There are about 75k names.
        const numberInserted = realm.objects( "CommonNamesRealm" ).length;

        const searchLocale = i18n.currentLocale( ).split( "-" )[0].toLowerCase( );
        const prevLanguage = realm.objects( "CommonNamesRealm" )[0].locale;

        console.log( prevLanguage, "prev language", searchLocale, "number inserted: ", numberInserted );
        // english has over 20k common names
        if ( searchLocale !== prevLanguage || numberInserted < 21000 ) {
          // delete all existing common names from Realm
          realm.delete( realm.objects( "CommonNamesRealm" ) );
          // load names from each file. React-native requires need to be strings
          // so each file is listed here instead of some kind of loop
          addCommonNamesFromFile( realm,
            require( "./commonNames/commonNamesDict-0" ).default );
          addCommonNamesFromFile( realm,
            require( "./commonNames/commonNamesDict-1" ).default );
          addCommonNamesFromFile( realm,
            require( "./commonNames/commonNamesDict-2" ).default );
          addCommonNamesFromFile( realm,
            require( "./commonNames/commonNamesDict-3" ).default );
          addCommonNamesFromFile( realm,
            require( "./commonNames/commonNamesDict-4" ).default );
          addCommonNamesFromFile( realm,
            require( "./commonNames/commonNamesDict-5" ).default );
          addCommonNamesFromFile( realm,
            require( "./commonNames/commonNamesDict-6" ).default );
          addCommonNamesFromFile( realm,
            require( "./commonNames/commonNamesDict-7" ).default );
        }
      } );
    } ).catch( ( err ) => {
      console.log( "[DEBUG] Failed to setup common names: ", err );
    } );
};

export {
  setupCommonNames // eslint-disable-line import/prefer-default-export
};
