import { MdOutlineAccountCircle } from 'react-icons/md';

interface Props {
	size?: 'sm' | 'lg';
}

export default function ProfilePicture({ size }: Props) {
	return (
		<div
			className={`${
				size === 'lg' ? 'w-20 h-20 text-9xl' : 'w-10 h-10 text-5xl'
			} rounded-full border border-stone-900 bg-stone-300 flex justify-center items-center`}>
			<MdOutlineAccountCircle className='text-stone-400' />
		</div>
	);
}
