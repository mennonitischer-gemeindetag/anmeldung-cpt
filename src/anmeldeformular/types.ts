import type { WP_REST_API_Post } from 'wp-types';

type EventMeta = {
	nr: number,
	character: string,
	beschreibung: string,
	startZeit: string,
	endZeit: string,
	maxPlaetze: Number,
	beschraenkt: Boolean,
	preis: Number,
	registrationClosed: Boolean,
}

export interface WP_REST_API_Workshop extends WP_REST_API_Post {
	meta: EventMeta & {
		leiter: string,
		ort: string,
	}
};

export interface WP_REST_API_Ausfluege extends WP_REST_API_Post {
	meta: EventMeta
}

export interface WP_REST_API_Tickets extends WP_REST_API_Post {
	meta: {
		price_adult: string,
		price_teen: string,
		price_kid: string,
	}
}

export interface WP_REST_API_Essen extends WP_REST_API_Post {
	meta: {
		price: string,
		tag: string,
		tageszeit: string,
	}
}

export interface WP_REST_API_Anmeldung extends WP_REST_API_Post {
	meta: {
		nachname: string,
		vorname: string,
		geschlecht: string,
		adresse_straße: string,
		adresse_plz: number,
		adresse_ort: string,
		geb_datum: string,
		ermaessigt_adult: boolean,
		telefonnummer: string,
		email: string,
		teilnahmetage: Number[],
		mitarbeit: string[],
		kinderprogramm: Number[],
		kinderprogramm_bemerkung: string,
		kinderprogramm_notfall_nummer: string,
		ausfluege: Number[],
		workshops: Number[],
		uebernachtung_and_breakfast: boolean,
		uebernachtung_zelt_mit: string,
		uebernachtung: string,
		verpflegung: Number[],
		bemerkung: string,
		allergien: string,
		datenschutz_akzeptiert: boolean,
		daten_fuer_mitfahrgelegenheit_teilen: boolean,
		gedrucktes_programmheft: boolean,
		gedrucktes_liederheft: boolean,
		status: string,
		rechnung_versand: boolean,
		betrag: number,
		zahlungsbestaetigung_versand: boolean,
	}
}
