// @flow

import React, { useState, useEffect, useCallback } from "react";
import inatjs from "inaturalistjs";
import { useNavigation, useRoute } from "@react-navigation/native";

import ConfirmScreen from "./ConfirmScreen";
import ErrorScreen from "./Error";
import {
  capitalizeNames,
  flattenUploadParameters,
  getTaxonCommonName,
  createJwtToken
} from "../../utility/helpers";
import { addToCollection } from "../../utility/observationHelpers";
import { fetchTruncatedUserLocation } from "../../utility/locationHelpers";
import createUserAgent from "../../utility/userAgent";
import { fetchSpeciesSeenDate, serverBackOnlineTime } from "../../utility/dateHelpers";

const OnlineServerResults = () => {
  const navigation = useNavigation();
  const { params } = useRoute();

  const [taxon, setTaxon] = useState( {} );
  const [image, setImage] = useState( params.image );
  const [observation, setObservation] = useState( null );
  const [seenDate, setSeenDate] = useState( null );
  const [match, setMatch] = useState( null );
  const [errorCode, setLocationErrorCode] = useState( null );
  const [error, setError] = useState( null );
  const [clicked, setClicked] = useState( false );
  const [numberOfHours, setNumberOfHours] = useState( null );

  const getUserLocation = useCallback( () => {
    fetchTruncatedUserLocation().then( ( coords ) => {
      if ( coords ) {
        const { latitude, longitude } = coords;

        image.latitude = latitude;
        image.longitude = longitude;

        setImage( image );
      }
    } ).catch( ( code ) => {
      setLocationErrorCode( code );
    } );
  }, [image] );

  const checkSpeciesSeen = ( taxaId ) => {
    fetchSpeciesSeenDate( taxaId ).then( ( date ) => {
      setSeenDate( date );
    } );
  };

  const setOnlineVisionSpeciesResults = ( species ) => {
    const { taxon } = species;
    const photo = taxon.default_photo;

    setObservation( species );

    getTaxonCommonName( taxon.id ).then( ( commonName ) => {
      const newTaxon = {
        taxaId: taxon.id,
        taxaName: capitalizeNames( commonName || taxon.name ),
        scientificName: taxon.name,
        speciesSeenImage: photo ? photo.medium_url : null
      };

      setTaxon( newTaxon );
      setMatch( true );
    } );
  };

  const setOnlineVisionAncestorResults = ( commonAncestor ) => {
    const { taxon } = commonAncestor;
    const photo = taxon.default_photo;

    getTaxonCommonName( taxon.id ).then( ( commonName ) => {
      const newTaxon = {
        commonAncestor: commonAncestor
          ? capitalizeNames( commonName || taxon.name )
          : null,
        taxaId: taxon.id,
        speciesSeenImage: photo ? photo.medium_url : null,
        scientificName: taxon.name,
        rank: taxon.rank_level
      };

      setTaxon( newTaxon );
      setMatch( false );
    } );
  };

  const fetchScore = useCallback( ( params ) => {
    const token = createJwtToken();

    const options = { api_token: token, user_agent: createUserAgent() };

    inatjs.computervision.score_image( params, options )
      .then( ( response ) => {
        const species = response.results[0];
        const commonAncestor = response.common_ancestor;

        if ( species.combined_score > 85 && species.taxon.rank === "species" ) {
          checkSpeciesSeen( species.taxon.id );
          setOnlineVisionSpeciesResults( species );
        } else if ( commonAncestor ) {
          setOnlineVisionAncestorResults( commonAncestor );
        } else {
          setMatch( false );
        }
      } ).catch( ( { response } ) => {
        if ( response.status && response.status === 503 ) {
          const gmtTime = response.headers.map["retry-after"];
          console.log( gmtTime, "gmt time" );
          const hours = serverBackOnlineTime( gmtTime );

          if ( hours ) {
            setNumberOfHours( hours );
          }
          setError( "downtime" );
        } else {
          setError( "onlineVision" );
        }
      } );
  }, [] );

  const addObservation = useCallback( async () => {
    await addToCollection( observation, image );
  }, [observation, image] );

  const getParamsForOnlineVision = useCallback( async () => {
    const uploadParams = await flattenUploadParameters( image );
    fetchScore( uploadParams );
  }, [fetchScore, image] );

  const checkForMatches = () => setClicked( true );

  const checkMetaData = useCallback( () => {
    // this should only apply to iOS photos with no metadata
    // once metadata is fixed, should be able to remove this check for user location
    if ( !image.latitude ) {
      getUserLocation();
      getParamsForOnlineVision();
    } else {
      getParamsForOnlineVision();
    }
  }, [image.latitude, getParamsForOnlineVision, getUserLocation] );

  const navigateToMatch = useCallback( () => {
    navigation.push( "Drawer", {
      screen: "Main",
      params: {
        screen: "Match",
        params: {
          taxon,
          image,
          seenDate,
          errorCode
        }
      }
    } );
  }, [taxon, image, seenDate, errorCode, navigation] );

  const showMatch = useCallback( async () => {
    if ( !seenDate && match ) {
      await addObservation();
      navigateToMatch();
    } else {
      navigateToMatch();
    }
  }, [navigateToMatch, seenDate, match, addObservation] );

  useEffect( () => {
    if ( match !== null && clicked ) {
      showMatch();
    }
  }, [match, showMatch, clicked] );

  useEffect( () => {
    navigation.addListener( "focus", () => {
      checkMetaData();
    } );
  }, [navigation, checkMetaData] );

  return (
    <>
      {error ? (
        <ErrorScreen
          error={error}
          number={numberOfHours}
        />
      ) : (
        <ConfirmScreen
          updateClicked={checkForMatches}
          clicked={clicked}
          image={image.uri}
        />
      )}
    </>
  );
};

export default OnlineServerResults;
