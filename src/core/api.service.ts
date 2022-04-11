import {ajax} from "rxjs/ajax";
import {map, Observable} from "rxjs";

export interface SearchItem {
	collectionName: string;
}

export interface SearchResponse {
	resultCount: number,
	results: SearchItem[]
}

export function searchMusicApi(term: string): Observable<SearchItem[]> {
	return ajax.getJSON<SearchResponse>(`https://itunes.apple.com/search?term=${term}`)
		.pipe(map(r => r.results))
}
