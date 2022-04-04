import { NavLink, Link } from 'remix';
import Button from './Button';

import { MdAddCircleOutline } from 'react-icons/md';
import { MdAddCircle } from 'react-icons/md';
import { MdOutlineSettings } from 'react-icons/md';
import { MdSettings } from 'react-icons/md';
import { MdOutlineExplore } from 'react-icons/md';
import { MdExplore } from 'react-icons/md';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { MdAccountCircle } from 'react-icons/md';

export default function MainNavigation() {
	const isAuthenticated = false;
	return (
		<div className='mt-2'>
			{isAuthenticated ? (
				//TODO: Add active navlink state
				<ul className='flex justify-evenly items-center my-1'>
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
							<MdOutlineAccountCircle className='text-2xl' />
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
			) : (
				<Link to='/login' className='w-full'>
					<Button
						className='w-full'
						buttonType='emphasized'
						buttonName='Log in or create account'
					/>
				</Link>
			)}
		</div>
	);
}
