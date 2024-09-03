import React from 'react';
import { siteConfig } from '@/config/site-config';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

export default function GoogleMapsComponent(props: any) {
	const { selectedPosition, setSelectedPosition } = props;

	const jodhpurLatLong = {
		lat: 26.2389,
		lng: 73.0243
	};

	const [currentPosition, setCurrentPosition] =
		React.useState(jodhpurLatLong);

	React.useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				setCurrentPosition({
					lat: position.coords.latitude,
					lng: position.coords.longitude
				});
				setSelectedPosition({
					lat: position.coords.latitude,
					lng: position.coords.longitude
				});
			});
		}
	}, []);

	const libraries = React.useMemo(() => ['places'], []);

	const mapOptions = React.useMemo<google.maps.MapOptions>(
		() => ({
			disableDefaultUI: true,
			clickableIcons: true,
			scrollwheel: false
		}),
		[]
	);

	const handleMapClick = (event: any) => {
		setSelectedPosition({
			lat: event.latLng.lat(),
			lng: event.latLng.lng()
		});
	};

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: siteConfig.mapsApiKey as string,
		libraries: libraries as any
	});
	return (
		<>
			{isLoaded ? (
				<GoogleMap
					options={mapOptions}
					zoom={20}
					center={currentPosition}
					mapTypeId={google.maps.MapTypeId.ROADMAP}
					mapContainerStyle={{
						width: 'auto',
						height: '200px'
					}}
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
