'use client';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';

export function AreaSelect({
	areas,
	handleSelectChange
}: {
	areas: { value: string; label: string }[];
	handleSelectChange: any;
}) {
	return (
		<Select onValueChange={handleSelectChange}>
			<SelectTrigger className='w-[180px]'>
				<SelectValue placeholder='Area' />
			</SelectTrigger>
			<SelectContent>
				{areas.map((area, index) => (
					<SelectItem value={area.value} key={index}>
						{area.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
