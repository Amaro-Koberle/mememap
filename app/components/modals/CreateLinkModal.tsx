import { Dialog } from '@headlessui/react';
import { Link } from 'remix';

import { MdOutlineWest } from 'react-icons/md';
import { MdOutlineEast } from 'react-icons/md';

type ModalProps = {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	nodeId: string;
};

export default function CreateLinkModal({
	isOpen,
	setIsOpen,
	nodeId,
}: ModalProps) {
	return (
		<Dialog
			open={isOpen}
			onClose={() => setIsOpen(false)}
			as='div'
			className='fixed z-10 overflow-y-auto bottom-0 left-0 w-screen'>
			<Dialog.Overlay className='fixed inset-0 bg-stone-900 opacity-30 -z-10' />
			<div className='z-10 bg-stone-200 rounded-t-2xl p-4'>
				<Dialog.Title className='text-lg'>Create link?</Dialog.Title>
				<div className='mt-4'>
					<Link to={`/links/new/incoming/${nodeId}/targetNodeId`}>
						<button
							className='rounded-xl bg-stone-300 py-2 px-4 gap-4 items-center flex flex-nowrap w-full my-2'
							onClick={() => setIsOpen(false)}>
							<MdOutlineEast className='text-2xl' />
							<div className='flex flex-col text-left'>
								<p>Outgoing</p>
								<p className='text-sm text-stone-500'>
									Link from this node to another
								</p>
							</div>
						</button>
					</Link>
					<Link to={`/links/new/outgoing/sourceNodeId/${nodeId}`}>
						<button
							className='rounded-xl bg-stone-300 py-2 px-4 gap-4 items-center flex flex-nowrap w-full my-2'
							onClick={() => setIsOpen(false)}>
							<MdOutlineWest className='text-2xl' />
							<div className='flex flex-col text-left'>
								<p>Incoming</p>
								<p className='text-sm text-stone-500'>
									Link from another node to this one
								</p>
							</div>
						</button>
					</Link>
				</div>
			</div>
		</Dialog>
	);
}
