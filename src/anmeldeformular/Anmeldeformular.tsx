import { useState, useEffect, createContext } from '@wordpress/element';
import Wizard from './Wizard';
import {
	PersonalInfo,
	TeilnameTage,
	Workshops,
	Ausfluege,
	Übernachtungen,
	Verpflegung,
	Übersicht,
} from './wizard-pages';
import apiFetch from '@wordpress/api-fetch';
import {
	transformKinderprogramm,
	transformEssen,
} from './helper/transform-data';
import moment from 'moment';
import Success from './wizard-pages/Success';
import Failure from './wizard-pages/Failure';

type AnmeldungProps = {
	age: Number;
	workshops: Array< Number >;
	tickets: Array< Number >;
	ausfluege: Array< Number >;
	kinderprogramm: Array< Number >;
};

export const AnmeldungKontext = createContext< AnmeldungProps >( {
	age: 18,
	tickets: [] as Number[],
	workshops: [] as Number[],
	ausfluege: [] as Number[],
	kinderprogramm: [] as Number[],
} );

export default () => {
	const [ age, setAge ] = useState( 18 );
	const [ workshops, setWorkshops ] = useState( [] );
	const [ ausfluege, setAusfluege ] = useState( [] );
	const [ kinderprogramm, setKinderprogramm ] = useState( [] );
	const [ tickets, setTickets ] = useState( [] );
	const [ essen, setEssen ] = useState( [] );
	const [ successfulSignUp, setSuccessfulSignUp ] = useState( false );
	const [ signUpId, setSignUpId ] = useState( null );
	const [ signUpError, setSignUpError ] = useState( null );

	const updateAge = ( birthdayDate ) => {
		const newAge = moment( '28.04.2023', 'DD.MM.YYYY' ).diff(
			moment( birthdayDate, 'DD.MM.YYYY' ),
			'years'
		);
		setAge( newAge );
	};

	useEffect( () => {
		( async () => {
			try {
				setWorkshops(
					await apiFetch( {
						path: '/wp/v2/workshops?per_page=100&filter[orderby]=meta_value&meta_key=nr',
					} )
				);

				setAusfluege(
					await apiFetch( {
						path: '/wp/v2/ausfluege?per_page=100&filter[orderby]=meta_value&meta_key=nr',
					} )
				);
				setTickets(
					await apiFetch( {
						path: '/wp/v2/tickets?per_page=100',
					} )
				);
				setEssen(
					await apiFetch( {
						path: '/wp/v2/essen?per_page=100',
					} )
				);
				setKinderprogramm(
					await apiFetch( {
						path: '/wp/v2/kinderprogramm?per_page=100',
					} )
				);
			} catch ( error ) {
				// eslint-disable-next-line no-console
				console.error( error );
			}
		} )();
	}, [] );

	const onSubmit = async ( values ) => {
		try {
			const response: string = await apiFetch( {
				path: '/gemeindetag/v1/signup',
				method: 'POST',
				body: JSON.stringify( values ),
				headers: {
					'Content-Type': 'application/json',
				},
			} );

			if ( ! isNaN( parseInt( response ) ) ) {
				setSignUpId( parseInt( response ) );
				setSuccessfulSignUp( true );
			}
			// eslint-disable-next-line no-console
			console.info( response );
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.error( error );
			setSignUpError( error );
		}
	};

	return (
		<AnmeldungKontext.Provider
			value={ { age, workshops, tickets, ausfluege, kinderprogramm } }
		>
			{ !! signUpError && <Failure error={ signUpError } /> }
			{ !! successfulSignUp && <Success signUpID={ signUpId } /> }
			{ ! signUpError && ! successfulSignUp && (
				<Wizard onSubmit={ onSubmit }>
					<PersonalInfo setAge={ updateAge } />
					<TeilnameTage
						tickets={ tickets }
						kinderprogramm={ transformKinderprogramm(
							kinderprogramm
						) }
					/>
					<Workshops workshops={ workshops } />
					<Ausfluege ausfluege={ ausfluege } />
					<Übernachtungen />
					<Verpflegung essen={ transformEssen( essen ) } />
					<Übersicht
						tickets={ tickets }
						kinderprogramm={ kinderprogramm }
						workshops={ workshops }
						ausfluege={ ausfluege }
						essen={ essen }
					/>
				</Wizard>
			) }
		</AnmeldungKontext.Provider>
	);
};
