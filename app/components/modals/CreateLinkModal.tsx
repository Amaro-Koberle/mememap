import Modal from './Modal';
import Button from '../Button';
import { Link } from 'remix';

import { MdOutlineWest } from 'react-icons/md';
import { MdOutlineEast } from 'react-icons/md';

type Props = {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	nodeId: string;
};

export default function CreateLinkModal({ isOpen, setIsOpen, nodeId }: Props) {
	return (
		<Modal
			setIsOpen={(arg) => setIsOpen(arg)}
			isOpen={isOpen}
			title='Create link'>
			<Link to={`/links/new/incoming/${nodeId}/targetNodeId`}>
				<Button
					className='w-full'
					onClick={() => setIsOpen(false)}
					buttonName='Outgoing'
					icon={<MdOutlineEast />}
					buttonDescription='Link from this node to another'
				/>
			</Link>
			<Link to={`/links/new/outgoing/sourceNodeId/${nodeId}`}>
				<Button
					className='w-full'
					onClick={() => setIsOpen(false)}
					buttonName='Incoming'
					icon={<MdOutlineWest />}
					buttonDescription='Link from another node to this one'
				/>
			</Link>
		</Modal>
	);
}
