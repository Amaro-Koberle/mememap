import { NavLink } from 'remix';

import { MdAddCircleOutline } from 'react-icons/md';
import { MdAddCircle } from 'react-icons/md';
import { MdOutlineSettings } from 'react-icons/md';
import { MdSettings } from 'react-icons/md';
import { MdOutlineExplore } from 'react-icons/md';
import { MdExplore } from 'react-icons/md';

export default function MainNavigation() {
	return (
		<nav className='bg-stone-200 w-full my-4 fixed bottom-0 left-0'>
			<ul className=' flex justify-evenly items-center'>
				<li key='explore'>
					<NavLink to='/nodes/' className='flex flex-col items-center'>
						<MdOutlineExplore className='text-2xl' />
						{/* <span className='text-sm'>Explore</span> */}
					</NavLink>
				</li>
				<li key='newNode'>
					<NavLink to='/nodes/new' className='flex flex-col items-center'>
						<MdAddCircleOutline className='text-2xl' />
						{/* <span className='text-sm'>New Node</span> */}
					</NavLink>
				</li>
				<li key='profile'>
					<NavLink to='/nodes/new' className='flex flex-col items-center'>
						<div className='w-6 h-6 rounded-full bg-stone-300'></div>
						{/* <span className='text-sm'>Profile</span> */}
					</NavLink>
				</li>
				<li key='settings'>
					<NavLink to='/settings' className='flex flex-col items-center'>
						<MdOutlineSettings className='text-2xl' />
						{/* <span className='text-sm'>Settings</span> */}
					</NavLink>
				</li>
			</ul>
		</nav>
	);
}
