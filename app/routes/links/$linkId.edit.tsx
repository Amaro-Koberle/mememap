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
import type { User } from '@prisma/client';
import { auth } from '~/utils/services/auth.server';

import { MdArrowBackIos } from 'react-icons/md';

import { db } from '~/utils/db.server';
import type { Link as NodeLink } from '@prisma/client';

type LoaderData = { link: NodeLink; user: User };

export const loader: LoaderFunction = async ({ params, request }) => {
	const user = await auth.isAuthenticated(request, {
		failureRedirect: '/',
	});
	const link = await db.link.findUnique({
		where: { id: params.linkId },
	});
	if (!link) throw new Error('Link not found');
	if (!user) throw new Error('User not found');
	if (link.authorId !== user.id)
		throw new Error('It looks like you are not allowed to edit this link');

	const data: LoaderData = { link, user };
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
