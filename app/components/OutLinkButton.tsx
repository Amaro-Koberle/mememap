import { Link, Form } from 'remix';

import type { Link as NodeLink } from '@prisma/client';
import { MdOutlineMoreVert } from 'react-icons/md';

interface Props {
	link: NodeLink;
	summonLinkDetailsModal: () => void;
}

export default function OutLinkButton({ link, summonLinkDetailsModal }: Props) {
	return (
		<li>
			<div className='rounded-xl bg-stone-300 mt-2 w-full flex items-center'>
				<Link to={`/nodes/${link.targetNodeId}`} className='p-3 w-full'>
					<span>{link.name}</span>
				</Link>
				<Form method='post'>
					<input type='hidden' name='linkId' value={link.id} />
					<button
						className='flex items-center space-x-3 pr-3'
						name='_action'
						value='showLinkDetails'
						onClick={() => {
							summonLinkDetailsModal();
						}}>
						<hr className='border-l h-8 border-stone-400' />
						<MdOutlineMoreVert className='text-xl' />
					</button>
				</Form>
			</div>
		</li>
	);
}
