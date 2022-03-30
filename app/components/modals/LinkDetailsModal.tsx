import { Dialog } from '@headlessui/react';
import { Link } from 'remix';

import { MdOutlineEdit } from 'react-icons/md';
import { MdDeleteOutline } from 'react-icons/md';

import type { Link as LinkPost } from '@prisma/client';

type ModalProps = {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	link: LinkPost;
};

export default function LinkDetailsModal({
	isOpen,
	setIsOpen,
	link,
}: ModalProps) {
	return (
		<Dialog
			open={isOpen}
			onClose={() => setIsOpen(false)}
			as='div'
			className='fixed z-10 overflow-y-auto bottom-0 left-0 w-screen'>
			<Dialog.Overlay className='fixed inset-0 bg-stone-900 opacity-30 -z-10' />
			<div className='z-10 bg-stone-200 rounded-t-2xl p-4'>
				<Dialog.Title className='text-lg'>{link.name}</Dialog.Title>
				<div className='flex justify-between items-center mt-4'>
					<div className='flex items-center gap-2'>
						<div className='w-10 h-10 rounded-full bg-stone-300'></div>
						<div className='flex flex-col'>
							<span>User Name</span>
							<span className='text-sm text-stone-500'>@username</span>
						</div>
					</div>
					<div className='flex flex-nowrap gap-1 h-10 items-center'>
						<Link
							to={`/links/${link.id}/edit`}
							className='flex items-center justify-center rounded-xl bg-stone-300 w-10 h-full text-xl'>
							<MdOutlineEdit />
						</Link>
						<button className='flex items-center justify-center rounded-xl bg-stone-300 w-10 h-full text-xl'>
							<MdDeleteOutline />
						</button>
					</div>
				</div>
			</div>
		</Dialog>
	);
}
