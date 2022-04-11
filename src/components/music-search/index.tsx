import React, {useEffect, useState} from 'react';
import {auditTime, map, Subject, switchMap} from "rxjs";
import {searchMusicApi} from "../../core/api.service";
import {onlyUnique} from "../../core/utils";
import MusicSearchView from "../music-search-view";
import {Container, TextField} from "@mui/material";

const txtSubject = new Subject<string>();
const apiQuery$ = txtSubject
	.pipe(auditTime(500))
	.pipe(switchMap(key => searchMusicApi(key)))
	.pipe(map(items => {
		return items.map(i => i.collectionName)
			.filter(onlyUnique)
			.sort()
			.slice(0, 5);
	}));

function MusicSearch() {
	const [t, setT] = useState(0);
	const [results, setResults] = useState<string[]>([]);
	const [carousel, setCarousel] = useState(['A', 'B', 'C', 'D', 'E']);

	useEffect(() => {
		const subscription = apiQuery$.subscribe(res => setResults(res));
		setTimeout(() => setT(t + 1), 1000);
		return () => subscription.unsubscribe();
	}, [])

	useEffect(() => {
		setTimeout(() => setT(t + 1), 1000);
		rotateCarousel();
	}, [t])

	const rotateCarousel = () => {
		const [head, ...tail] = carousel;
		const [resultsHead, ...resultsTail] = results;
		const newCarousel = [...tail, resultsHead || head];

		setResults(resultsTail);
		setCarousel(newCarousel);
	}

	return (
		<Container maxWidth='sm'>
			<TextField sx={{display: 'flex', paddingTop: 1, paddingBottom: 1}} variant="outlined"
								 onChange={event => txtSubject.next(event.target.value)} size="small"/>
			<MusicSearchView items={carousel}></MusicSearchView>
		</Container>
	);
}

export default MusicSearch;
