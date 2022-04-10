import { NavLink } from 'remix';
import { MdChevronRight } from 'react-icons/md';

interface Props {
	name: string;
	description?: string;
	to: string;
}

export default function MenuItem({ name, description, to }: Props) {
	return (
		<li key='explore'>
			<NavLink to={to} className='flex justify-between py-4 items-center'>
				<span>{name}</span>
				<div className='flex'>
					<span className='text-stone-500'>{description}</span>
					<MdChevronRight className='text-2xl' />
				</div>
			</NavLink>
		</li>
	);
}
