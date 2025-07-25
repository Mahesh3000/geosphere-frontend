import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useLoadScript } from '@react-google-maps/api';

export interface MapLocation {
    id: string;
    name: string;
    lat: number;
    lng: number;
    vicinity?: string; // short address from Places API

}

declare const google: any; // add this to avoid TS errors for global `google`

interface MapWrapperProps {
    filter: 'caremap' | 'openspace' | 'weekendradar' | 'trackez';
    setHospitals: (data: MapLocation[]) => void;

}

const containerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // fallback (San Francisco)

const sampleData: Record<string, MapLocation[]> = {
    caremap: [
        { id: '1', name: 'Hospital A', lat: 37.773, lng: -122.431 },
        { id: '2', name: 'Clinic B', lat: 37.779, lng: -122.412 },
    ],
    openspace: [
        { id: '3', name: 'Park X', lat: 37.769, lng: -122.446 },
        { id: '4', name: 'Garden Y', lat: 37.768, lng: -122.426 },
    ],
    weekendradar: [
        { id: '5', name: 'Museum M', lat: 37.784, lng: -122.408 },
        { id: '6', name: 'Theater N', lat: 37.785, lng: -122.420 },
    ],
    trackez: [
        { id: '7', name: 'Warehouse W', lat: 37.765, lng: -122.435 },
        { id: '8', name: 'Drop Point D', lat: 37.770, lng: -122.415 },
    ],
};

const MapWrapper: React.FC<MapWrapperProps> = ({ filter, setHospitals }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        libraries: ['places'], // THIS IS REQUIRED
    });

    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [markers, setMarkers] = useState<MapLocation[]>([]);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

    // const service = new google.maps.places.PlacesService(map);

    // Get user location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                () => setUserLocation(defaultCenter)
            );
        } else {
            setUserLocation(defaultCenter);
        }
    }, []);


    useEffect(() => {
        const filtered = sampleData[filter] || [];
        setMarkers(filtered);
        setHospitals(filtered);
    }, [filter]);


    useEffect(() => {
        if (!userLocation) return;

        const map = new google.maps.Map(document.createElement('div'));
        const service = new google.maps.places.PlacesService(map);
        const location = new google.maps.LatLng(userLocation.lat, userLocation.lng);

        let request: google.maps.places.PlaceSearchRequest = {
            location,
            radius: 5000,
        };

        switch (filter) {
            case 'caremap':
                request.type = 'hospital';
                break;
            case 'openspace':
                request.type = 'park'; // parks, natural open spaces
                break;
            case 'weekendradar':
                request.type = 'museum'; // museums, galleries, theaters can be added separately if needed
                break;
            case 'trackez':
                request.type = 'bicycle path'; // museums, galleries, theaters can be added separately if needed            
                break
            default:
                return;
        }

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                const newMarkers: Location[] = results.map((place, idx) => ({
                    id: place.place_id || idx.toString(),
                    name: place.name || 'Unnamed',
                    lat: place.geometry?.location?.lat() || 0,
                    lng: place.geometry?.location?.lng() || 0,
                    vicinity: place.vicinity || '', // short address if available
                }));

                setMarkers(newMarkers);
                setHospitals(newMarkers);

                if (newMarkers.length > 0 && userLocation) {
                    const directionsService = new google.maps.DirectionsService();

                    directionsService.route(
                        {
                            origin: userLocation,
                            destination: {
                                lat: newMarkers[0].lat,
                                lng: newMarkers[0].lng,
                            },
                            travelMode: google.maps.TravelMode.DRIVING,
                        },
                        (result, status) => {
                            if (status === google.maps.DirectionsStatus.OK) {
                                setDirections(result);
                            } else {
                                console.error('Directions request failed:', status);
                            }
                        }
                    );
                }
            } else {
                setMarkers([]);
                setHospitals([]);
                setDirections(null);

            }
        });
    }, [filter, userLocation]);


    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={userLocation || defaultCenter}
            zoom={13}
        >
            {/* User location marker */}
            {userLocation && (
                <Marker
                    position={userLocation}
                    label={{ text: 'you', color: '' }}
                    icon={{
                        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    }}
                />
            )}

            {/* Markers for current filter */}
            {markers.map(({ id, name, lat, lng }) => (
                <Marker key={id} position={{ lat, lng }} title={name} />
            ))}

            {directions && <DirectionsRenderer directions={directions} />}

        </GoogleMap>
    );
};

export default MapWrapper;
