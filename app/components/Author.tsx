import { MdOutlineAccountCircle } from 'react-icons/md';
import type { User } from '@prisma/client';

interface Props {
	author: User;
}
export default function Author({ author }: Props) {
	return (
		<div className='flex items-center gap-2'>
			<div className='w-10 h-10 rounded-full border border-stone-900 bg-stone-300 flex justify-center items-center text-5xl'>
				<MdOutlineAccountCircle className='text-stone-400' />
			</div>
			<div className='flex flex-col'>
				<span>{author.name}</span>
				<span className='text-sm text-stone-500'>{`@${author.username}`}</span>
			</div>
		</div>
	);
}
