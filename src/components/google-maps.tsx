import { useState, useEffect, useMemo, useRef } from 'react';
import { Marker, GoogleMap, useLoadScript } from '@react-google-maps/api';
import { getGeocode, getLatLng } from 'use-places-autocomplete';

import { siteConfig } from '@/config/site-config';
import { PlacesAutocomplete } from './PlacesAutocomplete';

const { googleMap } = siteConfig;

export default function GoogleMapsComponent(props: any) {
	const { selectedPosition, setSelectedPosition, address, setAddress } =
		props;

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
		console.log('Selected coordinates: ', {
			lat: event.latLng.lat(),
			lng: event.latLng.lng()
		});

		setSelectedPosition({
			lat: event.latLng.lat(),
			lng: event.latLng.lng()
		});
	};

	const [map, setMap] = useState(null);
	const [zoomLevel, setZoomLevel] = useState(googleMap.zoom);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const mapRef = useRef<google.maps.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement | null>(null);

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: googleMap.apiKey as string,
		libraries: libraries as any
	});

	const changeCoordinates = (coord: { latLng: any }) => {
		const { latLng } = coord;

		setSelectedPosition({
			lat: latLng.lat(),
			lng: latLng.lng()
		});
	};

	useEffect(() => {
		map?.panTo({ lat: selectedPosition.lat, lng: selectedPosition.lng });
	}, [selectedPosition.lat, selectedPosition.lng]);

	const updateLocation = () => {
		setTimeout(() => {
			console.log('Center coordinates: ', {
				lat: map?.getCenter().lat(),
				lng: map?.getCenter().lng()
			});
		}, 3000);
	};

	const setOnLoad = (map: any) => {
		mapRef.current = map;
		console.log('Loading Map Component...');
		setMap(map);
		console.log('Map Component Loaded...');
	};

	const setCurrentLocation = () => {
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
	};

	return (
		<>
			{isLoaded ? (
				<>
					<div ref={mapContainerRef}>
						<GoogleMap
							mapContainerClassName='mb-2 rounded-lg'
							options={mapOptions}
							zoom={googleMap.zoom}
							center={currentPosition}
							mapTypeId={google.maps.MapTypeId.ROADMAP}
							mapContainerStyle={googleMap.containerStyle}
							onLoad={setOnLoad}
							onCenterChanged={updateLocation}
							onClick={handleMapClick}
						>
							{selectedPosition && (
								<Marker
									position={selectedPosition}
									draggable
									animation={google.maps.Animation.DROP}
									onDragEnd={changeCoordinates}
								/>
							)}
						</GoogleMap>
					</div>
					<div className='flex items-center space-x-1'>
						<div className='w-full'>
							<PlacesAutocomplete
								onAddressSelect={(address) => {
									getGeocode({ address }).then((results) => {
										const { lat, lng } = getLatLng(
											results[0]
										);
										setSelectedPosition({
											lat: lat,
											lng: lng
										});
									});
								}}
								mapRef={mapRef}
								zoomLevel={zoomLevel}
								setZoomLevel={setZoomLevel}
								mapContainerRef={mapContainerRef}
								isFullscreen={isFullscreen}
								setIsFullscreen={setIsFullscreen}
								setCurrentLocation={setCurrentLocation}
							/>
						</div>
					</div>
				</>
			) : (
				<p>Loading...</p>
			)}
		</>
	);
}
