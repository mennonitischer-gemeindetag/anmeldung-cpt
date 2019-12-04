import moment from 'moment';

export const transformAnmeldungen = ( anmeldungen ) =>
	anmeldungen.map( ( anmeldung ) => {
		return {
			id: anmeldung.id,
			title: anmeldung.title.rendered,
			...anmeldung.meta,
			age: moment( '24.05.2020', 'DD.MM.YYYY' ).diff(
				moment( anmeldung.meta.geb_datum, 'DD.MM.YYYY' ),
				'years'
			),
		};
	} );

export const transformWp = ( posts ) =>
	posts.map( ( post ) => {
		return { id: post.id, title: post.title.rendered, ...post.meta };
	} );

export const Status = {
	pending: 'wartet auf zahlung',
	payed: 'bezahlt',
	canceled: 'storniert',
};

export const isStatus = ( status ) => ( item ) => item.status === status;

export const base64ToArrayBuffer = ( data ) => {
	const binaryString = window.atob( data );
	const binaryLen = binaryString.length;
	const bytes = new Uint8Array( binaryLen );
	for ( let i = 0; i < binaryLen; i++ ) {
		const ascii = binaryString.charCodeAt( i );
		bytes[ i ] = ascii;
	}
	return bytes;
};

export const getAnmeldungen = ( items, key, id ) =>
	items.filter( ( item ) => {
		return item[ key ] && item[ key ].includes( id );
	} ).length;

export const emptyAges = {};

for ( let i = 0; i < 100; i++ ) {
	emptyAges[ i ] = 0;
}
