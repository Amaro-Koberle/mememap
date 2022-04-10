import { Form, Link, useParams } from 'remix';
import Input from './Input';

import { MdOutlineEast } from 'react-icons/md';
import { MdArrowBackIos } from 'react-icons/md';

import type { Node } from '@prisma/client';
import Button from './Button';

interface Props {
	sourceNode: Node | null;
	targetNode: Node | null;
	actionData: {
		formError?: string;
		fieldErrors?: {
			name: string | undefined;
		};
		fields?: {
			name: string;
			sourceNodeId: string;
			targetNodeId: string;
		};
	};
}

export default function NewLinkForm({
	sourceNode,
	targetNode,
	actionData,
}: Props) {
	const params = useParams();
	return (
		<div>
			<header className='flex items-center justify-between text-xl mx-2'>
				<Link to='/nodes/'>
					<MdArrowBackIos />
				</Link>
				<h2>
					{params.linkDirection === 'outgoing'
						? targetNode?.name
						: sourceNode?.name}
				</h2>
				<div className='w-4'></div>
			</header>
			<div>
				<p className='mt-4 mx-2'>
					{params.linkDirection === 'outgoing'
						? targetNode?.content
						: sourceNode?.content}
				</p>
			</div>
			<Form className='mt-4' method='post'>
				<Input
					name='name'
					label='Link name'
					type='name'
					actionDataField={actionData?.fields?.name}
					actionDataFieldError={actionData?.fieldErrors?.name}
				/>
				<div>
					<input name='sourceNodeId' value={sourceNode?.id} type='hidden' />
					<input name='targetNodeId' value={targetNode?.id} type='hidden' />
				</div>
				<div>
					{actionData?.formError ? (
						<p role='alert'>{actionData.formError}</p>
					) : null}
					<Button
						className='w-full mt-2'
						buttonStyle='emphasized'
						icon={<MdOutlineEast />}
						buttonName='Create link'
						buttonDescription={
							params.linkDirection === 'outgoing'
								? `Link '${sourceNode?.name}' to this node`
								: `Link this node to '${targetNode?.name}'`
						}
					/>
				</div>
			</Form>
		</div>
	);
}
