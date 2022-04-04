import Modal from './Modal';
import { Link } from 'remix';

import { MdOutlineEdit } from 'react-icons/md';
import { MdDeleteOutline } from 'react-icons/md';

import type { Link as LinkPost } from '@prisma/client';
import Button from '../Button';

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
		<Modal title={link.name} isOpen={isOpen} setIsOpen={setIsOpen}>
			<div className='flex justify-between items-center mt-4'>
				<div className='flex items-center gap-2'>
					<div className='w-10 h-10 rounded-full bg-stone-300'></div>
					<div className='flex flex-col'>
						<span>User Name</span>
						<span className='text-sm text-stone-500'>@username</span>
					</div>
				</div>
				<div className='flex flex-nowrap gap-1 h-10 items-center'>
					<Link to={`/links/${link.id}/edit`}>
						<Button icon={<MdOutlineEdit />} />
					</Link>
					<Button icon={<MdDeleteOutline />} />
				</div>
			</div>
		</Modal>
	);
}
