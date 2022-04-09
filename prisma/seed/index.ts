import { PrismaClient } from '@prisma/client';
import { getUsers } from './data/users';
import { getNodes } from './data/nodes';
import { getLinks } from './data/links';

const db = new PrismaClient();

async function seed() {
	// create users
	await Promise.all(
		getUsers().map((user) => {
			return db.user.create({ data: user });
		})
	);
	// create nodes
	await Promise.all(
		getNodes().map((node) => {
			return db.node.create({ data: node });
		})
	);
	// create links
	await Promise.all(
		getLinks().map((link) => {
			return db.link.create({ data: link });
		})
	);
}

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await db.$disconnect();
	});
