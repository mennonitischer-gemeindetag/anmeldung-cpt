/* eslint-disable camelcase */
import { Spinner } from '@wordpress/components';

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

export default ( props ) => {
	const {
		meta: {
			bemerkung,
			room_type,
			number_of_adults,
			number_of_teenager,
			number_of_kids,
			number_of_toddlers,
			names,
			email,
			start_date,
			end_date,
		},
		isLoading,
		invoice,
	} = props;

	return (
		<div className={ 'show-anmeldung' }>
			<div className={ 'personal-info' }>
				<h2>Persönliche Infos:</h2>
				<p>
					Email Adresse: { email }
					<br />
					{ `Anzahl Erwachsene: ${ number_of_adults }` }
					<br />
					{ `Anzahl Jugendliche: ${ number_of_teenager }` }
					<br />
					{ `Anzahl Kinder: ${ number_of_kids }` }
					<br />
					{ `Anzahl Kleinkinder: ${ number_of_toddlers }` }
					<br />
					{ `Zimmerart: ${ room_type }` }
					<br />
				</p>
				<h3>Reise Daten</h3>
				<p>
					{ `Anreise: ${ start_date }` }
					<br />
					{ `Abreise: ${ end_date }` }
				</p>
				<h3>Namen</h3>
				<p>{ names }</p>
				<h3>Bemerkung</h3>
				<p>{ bemerkung }</p>
			</div>
			{ isLoading ? (
				<Spinner />
			) : (
				<>
					<h2 id="rechnung-label">Rechnung</h2>
					<object
						aria-labelledby="rechnung-label"
						height={ '850px' }
						width={ '100%' }
						style={ { border: '5px solid #7B7B7B' } }
						data={ URL.createObjectURL(
							new window.Blob(
								[ base64ToArrayBuffer( invoice ) ],
								{
									type: 'application/pdf',
								}
							)
						) }
					>
						Rechnungs PDF
					</object>
				</>
			) }
		</div>
	);
};
