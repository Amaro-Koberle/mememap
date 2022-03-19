import { PrismaClient } from '@prisma/client';
import { getNodes } from './data/nodes';
import { getLinks } from './data/links';

const db = new PrismaClient();

async function seed() {
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
		console.error(`There was an error while seeding: ${e}`);
		process.exit(1);
	})
	.finally(async () => {
		console.log('Successfully seeded database. Closing connection.');
		await db.$disconnect();
	});
