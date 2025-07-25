import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

interface Location {
    id: string;
    name: string;
    lat: number;
    lng: number;
}

declare const google: any; // add this to avoid TS errors for global `google`

interface MapWrapperProps {
    filter: 'caremap' | 'openspace' | 'weekendradar' | 'trackez';
    setHospitals: (data: Location[]) => void;

}

const containerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // fallback (San Francisco)

const sampleData: Record<string, Location[]> = {
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

const MapWrapper: React.FC<MapWrapperProps> = ({ filter }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        libraries: ['places'], // THIS IS REQUIRED

    });

    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [markers, setMarkers] = useState<Location[]>([]);

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

    console.log('userLocation', userLocation);

    // Update markers based on filter
    useEffect(() => {
        setMarkers(sampleData[filter] || []);
    }, [filter]);



    useEffect(() => {
        if (!userLocation) return;

        if (filter === 'caremap') {
            const map = new google.maps.Map(document.createElement('div'));
            const service = new google.maps.places.PlacesService(map);

            const location = new google.maps.LatLng(userLocation.lat, userLocation.lng);

            service.nearbySearch(
                {
                    location,
                    radius: 5000,
                    type: 'hospital',
                },
                (results: google.maps.places.PlaceResult[], status: string) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        const newMarkers: Location[] = results.map((place, idx) => ({
                            id: place.place_id || idx.toString(),
                            name: place.name || 'Unknown Hospital',
                            lat: place.geometry?.location?.lat() || 0,
                            lng: place.geometry?.location?.lng() || 0,
                        }));
                        setHospitals(newMarkers); // store in MainLayout

                        setMarkers(newMarkers);
                    } else {
                        setMarkers([]);
                    }
                }
            );
        } else {
            setMarkers(sampleData[filter] || []);
        }
    }, [filter, userLocation]);

    console.log("hospital", markers);


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
                <Marker key={id} position={{ lat, lng }} title={name} hospitals={markers} />
            ))}
        </GoogleMap>
    );
};

export default MapWrapper;
