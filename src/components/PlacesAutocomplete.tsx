import { useId } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ExpandIcon, MapPinIcon, PlusIcon } from 'lucide-react';
import { MinusIcon } from 'lucide-react';

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
	const {
		ready,
		value,
		suggestions: { status, data },
		setValue,
		clearSuggestions
	} = usePlacesAutocomplete({
		requestOptions: { componentRestrictions: { country: 'in' } },
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
				<li
					key={place_id}
					onClick={() => {
						setValue(description, false);
						clearSuggestions();
						onAddressSelect && onAddressSelect(description);
					}}
					className='focus:bg-orange-300 hover:bg-gray-300 border-b border-gray-500'
					role='option'
				>
					<strong>{main_text}</strong> <small>{secondary_text}</small>
				</li>
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
			<div className='flex items-center space-x-1'>
				<Input
					value={value}
					className='text-black rounded-md bg-white text-base outline-none focus-visible:outline-none'
					type='text'
					placeholder='Search address...'
					role='combobox'
					disabled={!ready}
					onChange={(e) => setValue(e.target.value)}
				/>
				<Button
					variant='outline'
					size='icon'
					type='button'
					onClick={setCurrentLocation}
				>
					<MapPinIcon className='h-4 w-4' />
				</Button>
				<Button
					variant='outline'
					size='icon'
					type='button'
					onClick={increaseZoom}
				>
					<PlusIcon className='h-4 w-4' />
				</Button>
				<Button
					variant='outline'
					size='icon'
					type='button'
					onClick={decreaseZoom}
				>
					<MinusIcon className='h-4 w-4' />
				</Button>
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
				<ul
					id={autocompleteResultsId}
					className='focus:bg-yellow-100'
					role='listbox'
					aria-label='Suggestions'
				>
					{renderSuggestions()}
				</ul>
			)}
		</>
	);
};
