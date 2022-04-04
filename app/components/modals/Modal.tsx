import { Dialog } from '@headlessui/react';

type ModalProps = {
	title: string;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	children: React.ReactNode;
};

export default function Modal({
	title,
	isOpen,
	setIsOpen,
	children,
}: ModalProps) {
	return (
		<Dialog
			open={isOpen}
			onClose={() => setIsOpen(false)}
			as='div'
			className='fixed z-10 overflow-y-auto bottom-0 left-0 w-screen'>
			<Dialog.Overlay className='fixed inset-0 bg-stone-900 opacity-30 -z-10' />
			<div className='z-10 bg-stone-200 rounded-t-2xl p-4'>
				<Dialog.Title className='text-lg'>{title}</Dialog.Title>
				<div className='mt-4 flex flex-col space-y-2'>{children}</div>
			</div>
		</Dialog>
	);
}
