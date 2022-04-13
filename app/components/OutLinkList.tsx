import { useState } from 'react';
import { MdNavigateNext } from 'react-icons/md';
import { MdNavigateBefore } from 'react-icons/md';

import type { Link as NodeLink } from '@prisma/client';
import OutLinkButton from './OutLinkButton';
interface Props {
	outLinks: NodeLink[];
	summonLinkDetailsModal: () => void;
}

export default function OutLinkList({
	outLinks,
	summonLinkDetailsModal,
}: Props) {
	const [currentSlide, setCurrentSlide] = useState(1);

	const linksPerSlide = 4;
	const numberOfOutLinks = outLinks.length;
	const numberOfSlides = Math.ceil(numberOfOutLinks / linksPerSlide);
	const indexOfLastLinkOnSlide = currentSlide * linksPerSlide;
	const indexOfFirstLinkOnSlide = indexOfLastLinkOnSlide - linksPerSlide;
	const linksOnCurrentSlide = outLinks.slice(
		indexOfFirstLinkOnSlide,
		indexOfLastLinkOnSlide
	);

	if (numberOfSlides !== 1 && numberOfSlides !== 0) {
		if (currentSlide > numberOfSlides || currentSlide < 1) {
			setCurrentSlide(1);
		}
	}

	return (
		<div>
			{numberOfSlides !== 1 && numberOfSlides !== 0 ? (
				<div className='flex justify-between text-xl'>
					<button
						onClick={() => {
							setCurrentSlide(currentSlide - 1);
						}}
						disabled={currentSlide <= 1}>
						<MdNavigateBefore />
					</button>
					<span className='text-sm text-stone-500'>{`${currentSlide}/${numberOfSlides}`}</span>
					<button
						onClick={() => {
							setCurrentSlide(currentSlide + 1);
						}}
						disabled={currentSlide >= numberOfSlides}>
						<MdNavigateNext />
					</button>
				</div>
			) : null}
			<ul>
				{linksOnCurrentSlide.map((link) => (
					<OutLinkButton
						key={link.id}
						link={link}
						summonLinkDetailsModal={summonLinkDetailsModal}
					/>
				))}
			</ul>
		</div>
	);
}
