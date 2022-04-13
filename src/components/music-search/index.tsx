import React, {useEffect, useState} from 'react';
import {auditTime, combineLatest, interval, map, scan, startWith, Subject, switchMap} from "rxjs";
import {searchMusicApi} from "../../core/api.service";
import {onlyUnique} from "../../core/utils";
import MusicSearchView from "../music-search-view";
import {Container, TextField} from "@mui/material";

interface State {
	carousel: string[];
	results: string[];
	t: number;
}

const initial: State = {
	carousel: ['A', 'B', 'C', 'D', 'E'],
	results: [],
	t: 0
}

const txtSubject = new Subject<string>();
const apiQuery$ = txtSubject
	.pipe(auditTime(500))
	.pipe(switchMap(key => searchMusicApi(key)))
	.pipe(map(items => {
		return items.map(i => i.collectionName)
			.filter(onlyUnique)
			.sort()
			.slice(0, 5);
	}))
	.pipe(startWith([]))

const carousel$ =
	combineLatest([interval(1000), apiQuery$])
		.pipe(scan((state, current) => {
			const [t, results] = current;
			return t > state.t ? {...rotate(state), t} : {...state, results};
		}, initial))

function rotate(state: State): State {
	const [head, ...tail] = state.carousel;
	const [resultsHead, ...resultsTail] = state.results;
	return {
		carousel: [...tail, resultsHead || head],
		results: [...resultsTail],
		t: state.t
	};
}

function MusicSearch() {
	const [carousel, setCarousel] = useState<string[]>([]);

	useEffect(() => {
		const sub = carousel$.subscribe(state => setCarousel(state.carousel));
		return () => sub.unsubscribe()
	}, [])

	return (
		<Container maxWidth='sm'>
			<TextField sx={{display: 'flex', paddingTop: 1, paddingBottom: 1}} variant="outlined"
								 onChange={event => txtSubject.next(event.target.value)} size="small"/>
			<MusicSearchView items={carousel}></MusicSearchView>
		</Container>
	);
}

export default MusicSearch;
