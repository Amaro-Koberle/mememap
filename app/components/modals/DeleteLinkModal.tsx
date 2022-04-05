import Modal from './Modal';
import Button from '../Button';
import { Form } from 'remix';

import { MdDeleteOutline } from 'react-icons/md';

type ModalProps = {
	isOpen: boolean;
	handleLinkDeletion: () => void;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	linkId: string;
};

export default function DeleteLinkModal({
	isOpen,
	handleLinkDeletion,
	setIsOpen,
	linkId,
}: ModalProps) {
	return (
		<Modal
			setIsOpen={(arg) => setIsOpen(arg)}
			isOpen={isOpen}
			title='Are you sure?'>
			<Form method='post'>
				<Button
					buttonType='danger'
					className='w-full'
					type='submit'
					name='linkId'
					value={linkId}
					buttonName='Delete link'
					buttonDescription='This action can&#8217;t be undone'
					icon={<MdDeleteOutline />}
					onClick={() => handleLinkDeletion()}
				/>
			</Form>
		</Modal>
	);
}
