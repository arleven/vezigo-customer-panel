'use client';

import { Shell } from '@/components/Shells/shell';

const error = () => {
	return (
		<Shell as='div' className='gap-12'>
			<main className='flex flex-1 flex-col gap-4 md:gap-8'>
				<div className='flex items-center gap-4'>
					<h1 className='font-semibold text-lg md:text-xl'>
						<span className='font-normal text-gray-500 dark:text-gray-400'>
							Failed to fetch order details 😢
						</span>
					</h1>
				</div>
			</main>
		</Shell>
	);
};

export default error;
