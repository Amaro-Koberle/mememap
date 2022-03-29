import { Form, Link, useParams } from 'remix';

import { MdOutlineEast } from 'react-icons/md';
import { MdArrowBackIos } from 'react-icons/md';

import type { Node } from '@prisma/client';

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
					{params.linkDirection == 'outgoing'
						? targetNode?.name
						: sourceNode?.name}
				</h2>
				<div className='w-4'></div>
			</header>
			<div>
				<p className='mt-4 mx-2'>
					{params.linkDirection == 'outgoing'
						? targetNode?.content
						: sourceNode?.content}
				</p>
			</div>
			<Form className='mt-4' method='post'>
				<div>
					<label className='rounded-xl border border-stone-900 flex flex-col p-2'>
						<span className='text-sm text-stone-600'>Link name</span>
						<input
							type='text'
							className='bg-stone-200'
							name='name'
							defaultValue={actionData?.fields?.name}
							aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
							aria-errormessage={
								actionData?.fieldErrors?.name ? 'name-error' : undefined
							}
						/>
					</label>
					{actionData?.fieldErrors?.name ? (
						<p role='alert' id='name-error'>
							{actionData.fieldErrors.name}
						</p>
					) : null}
				</div>
				<div>
					<input name='sourceNodeId' value={sourceNode?.id} type='hidden' />
					<input name='targetNodeId' value={targetNode?.id} type='hidden' />
				</div>
				<div>
					{actionData?.formError ? (
						<p role='alert'>{actionData.formError}</p>
					) : null}
					<button
						type='submit'
						className='rounded-xl bg-stone-800 text-stone-200 py-2 px-4 gap-4 items-center flex flex-nowrap w-full my-2'>
						<MdOutlineEast className='text-2xl' />
						<div className='flex flex-col text-left'>
							<p>Create link</p>
							<p className='text-sm text-stone-400'>
								{params.linkDirection == 'outgoing'
									? `Link '${sourceNode?.name}' to this node`
									: `Link this node to '${targetNode?.name}'`}
							</p>
						</div>
					</button>
				</div>
			</Form>
		</div>
	);
}
