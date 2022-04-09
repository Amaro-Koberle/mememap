import { Authenticator } from 'remix-auth';
import { EmailLinkStrategy } from 'remix-auth-email-link';
import { sessionStorage } from './session.server';
import { sendEmail } from './email.server';
import { db } from '~/utils/db.server';
import type { User } from '@prisma/client';

// This secret is used to encrypt the token sent in the magic link and the
// session used to validate someone else is not trying to sign-in as another
// user.
const secret = process.env.MAGIC_LINK_SECRET;
if (!secret) throw new Error('Missing MAGIC_LINK_SECRET env variable.');

export const auth = new Authenticator<User>(sessionStorage);

// Here we need the sendEmail, the secret and the URL where the user is sent
// after clicking on the magic link
auth.use(
	new EmailLinkStrategy(
		{ sendEmail, secret, callbackURL: '/magic' },
		// In the verify callback,
		// you will receive the email address, form data and whether or not this is being called after clicking on magic link
		// and you should return the user instance
		async ({ email }: { email: string }) => {
			const user = await db.user.findUnique({ where: { email: email } });
			if (!user) throw new Error('User not found');
			return user;
		}
	)
);
