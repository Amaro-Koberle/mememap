import Modal from './Modal';
import { Link, json } from 'remix';
import type { ActionFunction } from 'remix';
import { useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import { MdDeleteOutline } from 'react-icons/md';
import type { User, Link as NodeLink } from '@prisma/client';
import Button from '../Button';
import DeleteLinkModal from './DeleteLinkModal';
import { db } from '~/utils/db.server';
import Author from '../Author';

type ActionData = {
	formError?: string;
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const linkId = form.get('linkId');
	if (typeof linkId !== 'string') {
		return badRequest({
			formError: `Link deletion failed.`,
		});
	}

	await db.link.delete({ where: { id: linkId } });
};

type ModalProps = {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	link: NodeLink;
	linkAuthor: User;
};

export default function LinkDetailsModal({
	isOpen,
	setIsOpen,
	link,
	linkAuthor,
}: ModalProps) {
	const [deleteLinkModalIsOpen, setDeleteLinkModalIsOpen] = useState(false);
	const handleLinkDeletion = () => {
		setDeleteLinkModalIsOpen(false);
		setIsOpen(false);
	};
	return (
		<>
			{deleteLinkModalIsOpen ? (
				<DeleteLinkModal
					linkId={link.id}
					isOpen={deleteLinkModalIsOpen}
					setIsOpen={setDeleteLinkModalIsOpen}
					handleLinkDeletion={handleLinkDeletion}
				/>
			) : (
				<Modal title={link.name} isOpen={isOpen} setIsOpen={setIsOpen}>
					<div className='flex justify-between items-center mt-4'>
						<Author author={linkAuthor} />
						<div className='flex flex-nowrap gap-1 h-10 items-center'>
							<Link to={`/links/${link.id}/edit`}>
								<Button icon={<MdOutlineEdit />} />
							</Link>
							<Button
								icon={<MdDeleteOutline />}
								onClick={() => {
									setDeleteLinkModalIsOpen(true);
								}}
							/>
						</div>
					</div>
				</Modal>
			)}
		</>
	);
}
