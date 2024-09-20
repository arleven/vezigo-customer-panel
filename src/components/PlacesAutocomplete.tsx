import { useId } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { Button } from './ui/button';
import { ExpandIcon, MapPinIcon, PlusIcon } from 'lucide-react';
import { MinusIcon } from 'lucide-react';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from './ui/command';

export const PlacesAutocomplete = ({
	onAddressSelect,
	mapRef,
	zoomLevel,
	setZoomLevel,
	mapContainerRef,
	isFullscreen,
	setIsFullscreen,
	setCurrentLocation
}: {
	onAddressSelect?: (address: string) => void;
	mapRef: any;
	zoomLevel: number;
	setZoomLevel: any;
	mapContainerRef: any;
	isFullscreen: boolean;
	setIsFullscreen: any;
	setCurrentLocation: any;
}) => {
	const autocompleteResultsId = useId();

	const jodhpurBounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(26.027, 72.878), // SW corner
		new google.maps.LatLng(26.416, 73.17) // NE corner
	);

	const {
		ready,
		value,
		suggestions: { status, data },
		setValue,
		clearSuggestions
	} = usePlacesAutocomplete({
		requestOptions: {
			bounds: jodhpurBounds,
			componentRestrictions: { country: 'in' }
		},
		debounce: 300,
		cache: 86400
	});

	const renderSuggestions = () => {
		return data.map((suggestion) => {
			const {
				place_id,
				structured_formatting: { main_text, secondary_text },
				description
			} = suggestion;
			return (
				<CommandItem
					key={place_id}
					onSelect={() => {
						setValue(description, false);
						clearSuggestions();
						onAddressSelect && onAddressSelect(description);
					}}
				>
					<span>
						{main_text}
						{secondary_text ? `, ${secondary_text}` : ''}
					</span>
				</CommandItem>
			);
		});
	};

	const increaseZoom = () => {
		if (mapRef.current) {
			const newZoom = zoomLevel + 1;
			mapRef.current.setZoom(newZoom);
			setZoomLevel(newZoom);
		}
	};

	const decreaseZoom = () => {
		if (mapRef.current) {
			const newZoom = zoomLevel - 1;
			mapRef.current.setZoom(newZoom);
			setZoomLevel(newZoom);
		}
	};

	const toggleFullscreen = () => {
		if (mapContainerRef.current) {
			if (!isFullscreen) {
				mapContainerRef.current.requestFullscreen();
			} else {
				document.exitFullscreen();
			}
			setIsFullscreen(!isFullscreen);
		}
	};

	return (
		<>
			<Command>
				<div className='flex items-center space-x-1'>
					<CommandInput
						placeholder='Search address...'
						value={value}
						className='text-black rounded-md bg-white text-base sm:w-full'
						onValueChange={setValue}
						disabled={!ready}
					/>

					<CurrentLocationButton setLocation={setCurrentLocation} />
					<ZoomInButton increaseZoom={increaseZoom} />
					<ZoomOutButton decreaseZoom={decreaseZoom} />
					{/* <Button
					variant='outline'
					size='icon'
					type='button'
					onClick={toggleFullscreen}
				>
					<ExpandIcon className='h-4 w-4' />
				</Button> */}
				</div>
				{status === 'OK' && (
					<CommandList id={autocompleteResultsId}>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup heading='Suggestions'>
							{renderSuggestions()}
						</CommandGroup>
					</CommandList>
				)}
			</Command>
		</>
	);
};

const CurrentLocationButton = (props: any) => {
	return (
		<Button
			variant='outline'
			size='icon'
			type='button'
			onClick={props.setLocation}
		>
			<MapPinIcon className='h-4 w-4' />
		</Button>
	);
};

const ZoomInButton = (props: any) => {
	return (
		<Button
			variant='outline'
			size='icon'
			type='button'
			onClick={props.increaseZoom}
		>
			<PlusIcon className='h-4 w-4' />
		</Button>
	);
};

const ZoomOutButton = (props: any) => {
	return (
		<Button
			variant='outline'
			size='icon'
			type='button'
			onClick={props.decreaseZoom}
		>
			<MinusIcon className='h-4 w-4' />
		</Button>
	);
};
