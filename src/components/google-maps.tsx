import { useState, useEffect, useMemo } from 'react';
import { siteConfig } from '@/config/site-config';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const { googleMap } = siteConfig;

export default function GoogleMapsComponent(props: any) {
	const { selectedPosition, setSelectedPosition } = props;

	const [currentPosition, setCurrentPosition] = useState(
		googleMap.defaultLatLong
	);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				const coords = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				setCurrentPosition(coords);
				setSelectedPosition(coords);
			});
		}
	}, []);

	const libraries = useMemo(() => ['places'], []);

	const mapOptions = useMemo<google.maps.MapOptions>(
		() => googleMap.options,
		[]
	);

	const handleMapClick = (event: any) => {
		setSelectedPosition({
			lat: event.latLng.lat(),
			lng: event.latLng.lng()
		});
	};

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: googleMap.apiKey as string,
		libraries: libraries as any
	});

	return (
		<>
			{isLoaded ? (
				<GoogleMap
					options={mapOptions}
					zoom={googleMap.zoom}
					center={currentPosition}
					mapTypeId={google.maps.MapTypeId.ROADMAP}
					mapContainerStyle={googleMap.containerStyle}
					onLoad={() => console.log('Map Component Loaded...')}
					onClick={handleMapClick}
				>
					{selectedPosition && <Marker position={selectedPosition} />}
				</GoogleMap>
			) : (
				<p>Loading...</p>
			)}
		</>
	);
}
