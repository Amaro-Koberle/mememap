import { Dialog } from '@headlessui/react';
import { Form } from 'remix';

import { MdDeleteOutline } from 'react-icons/md';

type ModalProps = {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	nodeId: string;
};

export default function DeleteNodeModal({
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
				<Dialog.Title className='text-lg'>Are you sure?</Dialog.Title>
				<Form method='post' className='mt-4'>
					<button
						type='submit'
						name='nodeId'
						value={nodeId}
						className='rounded-xl text-red-900 bg-red-300 py-2 px-4 gap-4 items-center flex flex-nowrap w-full my-2'
						// onClick={() => setIsOpen(false)}
					>
						<MdDeleteOutline className='text-2xl' />
						<div className='flex flex-col text-left'>
							<p>Delete node</p>
							<p className='text-sm text-red-700'>
								This action can't be undone
							</p>
						</div>
					</button>
				</Form>
			</div>
		</Dialog>
	);
}
