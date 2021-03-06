import Modal from './Modal';
import Button from '../Button';
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
		<Modal
			setIsOpen={(arg) => setIsOpen(arg)}
			isOpen={isOpen}
			title='Are you sure?'>
			<Form method='post' action='/nodes/:nodeId'>
				<input type='hidden' name='nodeId' value={nodeId} />
				<Button
					buttonStyle='danger'
					className='w-full'
					type='submit'
					name='_action'
					value='deleteNode'
					buttonName='Delete node'
					buttonDescription='This action can&#8217;t be undone'
					icon={<MdDeleteOutline />}
					// onClick={() => setIsOpen(false)}
				/>
			</Form>
		</Modal>
	);
}
