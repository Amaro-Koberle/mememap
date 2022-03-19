import { PrismaClient } from '@prisma/client';
import { Nodes } from './data/nodes';
import { Links } from './data/links';

const db = new PrismaClient();

interface Node {
	id: string;
	name: string;
	content: string;
}
interface Link {
	id: string;
	name: string;
	sourceNodeId: string;
	targetNodeId: string;
}

async function seed() {
	// Nodes
	await Promise.all(
		Nodes.map(async (node: Node) =>
			db.node.upsert({
				where: { id: node.id },
				update: {},
				create: node,
			})
		)
	);
	// Links
	await Promise.all(
		Links.map(async (link: Link) =>
			db.link.upsert({
				where: { id: link.id },
				update: {},
				create: link,
			})
		)
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
