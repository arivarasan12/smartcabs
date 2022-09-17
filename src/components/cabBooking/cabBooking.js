import Header from '../Home/header';
import RecommendedCabs from './recommendedCabs';
import Map from './map';
import SideForm from './sideForm';

import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
//Map imports
import { useJsApiLoader } from '@react-google-maps/api';

// Map Constants
const LIBRARIES = ['places'];

const CabBooking = () => {
  const [pickupRequiredValidationFlag, setPickupRequiredValidationFlag] =
    useState(false);
  const [dropRequiredValidationFlag, setdropRequiredValidationFlag] =
    useState(false);
  const [showRecommendedCabs, setShowRecommendedCabs] = useState(false);
  const [recommendedSelectedCab, setRecommendedSelectedCab] = useState(1);
  // Map state
  const [center, setCenter] = useState({ lat: 19.075983, lng: 72.877655 });
  const [map, setMap] = useState(/** @type google.maps.Map */ null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  /** @type React.MutableRefObject<HTMLInputElement> */
  const pickupRef = useRef();
  const dropRef = useRef();

  const location = useLocation();
  let navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDJlbhYyDTemG0tYpyObolvcmjdkrmt3w4',
    libraries: [...LIBRARIES],
  });

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(function(position) {
      setCenter(() => {
        return {lat: position.coords.latitude, lng: position.coords.longitude}
      });
    });
  }

  const calculateRoute = async () => {
    if (
      pickupRef.current.value.trim() === '' &&
      dropRef.current.value.trim() === ''
    ) {
        setPickupRequiredValidationFlag(true);
        setdropRequiredValidationFlag(true);
      return;
    }

    if (pickupRef.current.value.trim() === '') {
        setPickupRequiredValidationFlag(true);
      return;
    }

    if (dropRef.current.value.trim() === '') {
        setdropRequiredValidationFlag(true);
      return;
    }

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: pickupRef.current.value,
      destination: dropRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    console.log(results.routes[0].legs[0].distance.text); // set this value in state
    console.log(results.routes[0].legs[0].duration.text); // set this value in state
  };

  const clearRoute = () => {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    pickupRef.origin.value = '';
    dropRef.origin.value = '';
  };

  const setRecommendedCabsVisibility = () => {
    setShowRecommendedCabs(!showRecommendedCabs);
  };

  const handleRecommendedCabChange = (id) => {
    setRecommendedSelectedCab(id);
  };

  return (
    <>
      {/* Skeleton until map is loaded */}
      {!isLoaded && (
        <div className='shadow rounded-md p-4 h-[100vh]'>
          <div className='animate-pulse flex space-x-4'>
            <div className='flex-1 space-y-6 py-1'>
              <div className='h-2 bg-slate-700 rounded'></div>
              <div className='space-y-3'>
                <div className='grid grid-cols-3 gap-4'>
                  <div className='h-2 bg-slate-700 rounded col-span-2'></div>
                  <div className='h-2 bg-slate-700 rounded col-span-1'></div>
                </div>
                <div className='h-2 bg-slate-700 rounded'></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <Header />
            <SideForm />
            <Map />
            <AvailableCabs /> */}
      {/* {isLoaded && <Map center={CENTER} setMap={setMap} directionsResponse={directionsResponse} />} */}
      {isLoaded && (
        <>
          <SideForm calculateRoute={calculateRoute} pickupRequiredValidationFlag={pickupRequiredValidationFlag} dropRequiredValidationFlag={dropRequiredValidationFlag} pickupRef={pickupRef} dropRef={dropRef} />        
            <Map
              center={center}
              setMap={setMap}
              directionsResponse={directionsResponse}
            />
          <RecommendedCabs
            showRecommendedCabs={showRecommendedCabs}
            setRecommendedCabsVisibility={setRecommendedCabsVisibility}
            recommendedSelectedCab={recommendedSelectedCab}
            handleRecommendedCabChange={handleRecommendedCabChange}
          />
        </>
      )}
    </>
  );
};

export default CabBooking;