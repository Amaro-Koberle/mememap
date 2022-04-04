import { ActionFunction, LoaderFunction } from 'remix';
import {
	useActionData,
	useLoaderData,
	Link,
	Form,
	redirect,
	json,
} from 'remix';
import Input from '~/components/Input';

import { MdArrowBackIos } from 'react-icons/md';

import { db } from '~/utils/db.server';
import type { Link as LinkPost } from '@prisma/client';

type LoaderData = { link: LinkPost };

export const loader: LoaderFunction = async ({ params }) => {
	const link = await db.link.findUnique({
		where: { id: params.linkId },
	});
	if (!link) throw new Error('Link not found');

	const data: LoaderData = { link };
	return json(data);
};

function validateLinkName(name: string) {
	if (name.length < 3) {
		return `That name is too short`;
	}
}

type ActionData = {
	formError?: string;
	fieldErrors?: {
		name: string | undefined;
	};
	fields?: {
		name: string;
	};
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const linkId = form.get('linkId');
	const name = form.get('name');
	if (typeof linkId !== 'string' || typeof name !== 'string') {
		return badRequest({
			formError: `Form not submitted correctly.`,
		});
	}

	const fieldErrors = {
		name: validateLinkName(name),
	};

	const fields = { name };
	if (Object.values(fieldErrors).some(Boolean)) {
		return badRequest({ fieldErrors, fields });
	}

	const link = await db.link.update({ where: { id: linkId }, data: fields });
	return redirect(`nodes/${link.sourceNodeId}`);
};

export default function NewNodeRoute() {
	const actionData = useActionData<ActionData>();
	const data = useLoaderData<LoaderData>();
	return (
		<div>
			<header className='flex items-center justify-between text-xl mx-2'>
				<Link to={`/nodes/${data.link.id}`} className=''>
					<MdArrowBackIos />
				</Link>
				<h2>Edit link</h2>
				<div className='w-4'></div>
			</header>
			<Form method='post' className='mt-4'>
				<Input
					label='Link name'
					name='name'
					type='text'
					actionDataField={
						actionData?.fields?.name ? actionData?.fields?.name : data.link.name
					}
					actionDataFieldError={actionData?.fieldErrors?.name}
				/>
				<input name='linkId' value={data.link.id} type='hidden' />
				{actionData?.formError ? (
					<p className='form-validation-error' role='alert'>
						{actionData.formError}
					</p>
				) : null}
				<button
					className='uppercase font-bold text-lg absolute top-3 right-4'
					type='submit'>
					Save
				</button>
			</Form>
		</div>
	);
}
