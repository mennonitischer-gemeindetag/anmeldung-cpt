/* eslint-disable no-console */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import { useState, useReducer, useEffect } from '@wordpress/element';
import {
	Spinner,
	__experimentalNumberControl as NumberControl,
	__experimentalInputControl as InputControl,
	TextareaControl,
	RadioControl,
	CheckboxControl,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

export const Success = ( props ) => {
	return (
		<div>
			<h2 className={ 'section-heading' }>Vielen Dank!</h2>
			<div>
				Deine Anfrage ({ props.signUpID }) für die Jugendherberge am
				AMG-Gemeindetag 2023 in Neuwied ist eingegangen. Du solltest in
				den nächsten Minuten eine E-Mail von{ ' ' }
				<a href="mailto:gemeindetag@mennoniten.de">
					gemeindetag@mennoniten.de
				</a>{ ' ' }
				bekommen.{ '\n' }
				Sollte dies nicht der Fall sein, kontrolliere deinen SPAM
				Ordner. Sollte nach 24 Stunden keine E-Mail eingegangen sein,
				wende dich an{ ' ' }
				<a href="mailto:gemeindetag@mennoniten.de">
					gemeindetag@mennoniten.de
				</a>
				.
				<button
					className="submit-button"
					type="button"
					onClick={ () => {
						window.location.reload();
					} }
				>
					Weitere Anmeldung ausfüllen
				</button>
			</div>
		</div>
	);
};

export const Failure = ( props ) => {
	return (
		<div>
			<h2 className={ 'section-heading' }>
				Leider ist ein Fehler aufgetreten.
			</h2>
			<div>
				Bitte versuche es in einigen Minuten erneut. Sollte der Fehler
				mehrfach auftreten, melde dich bitte unter folgender
				E-Mail-Adresse bei uns:{ ' ' }
				<a href="mailto:gemeindetag@mennoniten.de">
					gemeindetag@mennoniten.de
				</a>
				. Danke für dein Verständnis!
			</div>
			<h3>Fehlermeldung:</h3>
			<pre>{ props.error }</pre>
		</div>
	);
};

export const Anmeldeformular = () => {
	const [ roomType, setRoomType ] = useState( 'einzelzimmer' );
	const [ adults, setAdults ] = useState( 0 );
	const [ teenager, setTeenager ] = useState( 0 );
	const [ children, setChildren ] = useState( 0 );
	const [ toddlers, setToddlers ] = useState( 0 );
	const [ datenschutzAkzeptiert, setDatenschutzAkzeptiert ] =
		useState( false );
	const [ bemerkung, setBemerkung ] = useState( '' );
	const [ email, setEmail ] = useState( '' );
	const [ namen, setNamen ] = useState( '' );
	const [ signUpID, setSignUpID ] = useState< Number >();
	const [ error, setError ] = useState< String >();

	const formStateReducer = ( state, action ) => {
		switch ( action.type ) {
			case 'START_SUBMIT':
				return { ...state, submitting: true };
			case 'SUBMIT_SUCCESS':
				return { ...state, submitting: false, submitSucceeded: true };
			case 'SUBMIT_FAILURE':
				return { ...state, submitting: false, submitFailed: true };
			default:
				return state;
		}
	};

	const [ formState, dispatch ] = useReducer( formStateReducer, {
		submitting: false,
		submitSucceeded: false,
		submitFailed: false,
	} );

	const handleFormSubmit = async ( event ) => {
		event.preventDefault();

		dispatch( { type: 'START_SUBMIT' } );
		const values = {
			room_type: roomType,
			number_of_adults: adults,
			number_of_teenager: teenager,
			number_of_kids: children,
			number_of_toddlers: toddlers,
			names: namen,
			email,
			bemerkung,
			datenschutz_akzeptiert: datenschutzAkzeptiert,
		};

		try {
			const response: string = await apiFetch( {
				path: '/gemeindetag/v1/jugendherberge-signup',
				method: 'POST',
				body: JSON.stringify( values ),
				headers: {
					'Content-Type': 'application/json',
				},
			} );

			if ( ! isNaN( parseInt( response ) ) ) {
				dispatch( { type: 'SUBMIT_SUCCESS' } );
				setSignUpID( parseInt( response, 10 ) );
			}
		} catch ( error ) {
			dispatch( { type: 'SUBMIT_FAILURE' } );
			console.error( error );
			setError( error.message );
		}
	};

	const isSubmitting = formState.submitting;
	const hasSubmitSucceeded = formState.submitSucceeded;
	const hasSubmitFailed = formState.submitFailed;

	const totalNumberOfPeople =
		Number( adults ) +
		Number( teenager ) +
		Number( children ) +
		Number( toddlers );

	const hasKids =
		Number( teenager ) + Number( children ) + Number( toddlers ) > 0;

	useEffect( () => {
		if ( hasKids ) {
			setRoomType( 'mehrbettzimmer' );
		}
	}, [ hasKids, setRoomType ] );

	if ( hasSubmitSucceeded ) {
		return <Success signUpID={ signUpID } />;
	}

	if ( hasSubmitFailed ) {
		return <Failure error={ error } />;
	}

	return (
		<form onSubmit={ handleFormSubmit }>
			{ isSubmitting && <Spinner /> }
			<h2 className={ 'section-heading' }>Anfrage Formular:</h2>
			<p>
				Die anmeldung für die Jugendherberge ist nur über dieses
				Formular möglich. Alle anfragen werden von uns bearbeitet und
				dann per E-Mail bestätigt. Die Anmeldung ist erst gültig, wenn
				Sie eine Bestätigung erhalten haben.
			</p>
			<InputControl
				label="E-Mail Adresse"
				value={ email }
				onChange={ setEmail }
				required
				type="email"
				help="Bitte geben Sie Ihre E-Mail Adresse an, damit wir Ihnen die Rechnung zukommen lassen können."
			/>
			<h3>Zimmer Art</h3>
			<RadioControl
				selected={ hasKids ? 'mehrbettzimmer' : roomType }
				options={ [
					{
						label: 'Einzelbelegung 41,90 €/Nacht',
						value: 'einzelzimmer',
					},
					{
						label: 'Doppelzimmer 33,90 €/Nacht/Person',
						value: 'doppelzimmer',
					},
					{
						label: 'Mehrbettzimmer 27,10 €/Nacht/Person',
						value: 'mehrbettzimmer',
					},
				] }
				onChange={ ( value ) =>
					setRoomType( hasKids ? 'mehrbettzimmer' : value )
				}
				help={
					hasKids
						? 'Mit Kindern ist nur das Mehrbettzimmer möglich'
						: ''
				}
			/>

			<h3>Anzahl der Personen ({ totalNumberOfPeople })</h3>
			<NumberControl
				isDragEnabled={ false }
				label="Erwachsene"
				onChange={ setAdults }
				size="__unstable-large"
				spinControls="custom"
				value={ adults }
				min={ 0 }
			/>
			<NumberControl
				isDragEnabled={ false }
				label="Jugendliche ab 15 Jahre"
				onChange={ setTeenager }
				size="__unstable-large"
				spinControls="custom"
				value={ teenager }
				min={ 0 }
			/>
			<NumberControl
				isDragEnabled={ false }
				label="Kinder 4-14 Jahre"
				onChange={ setChildren }
				size="__unstable-large"
				spinControls="custom"
				value={ children }
				min={ 0 }
			/>
			<NumberControl
				isDragEnabled={ false }
				label="Kinder bis 3 Jahre"
				onChange={ setToddlers }
				size="__unstable-large"
				spinControls="custom"
				value={ toddlers }
				min={ 0 }
			/>
			<br />
			<TextareaControl
				label="Namen der Personen"
				value={ namen }
				onChange={ setNamen }
				required
			/>
			<br />
			<TextareaControl
				label="Bemerkungen"
				value={ bemerkung }
				onChange={ setBemerkung }
			/>
			<br />
			<CheckboxControl
				label="Ich habe die Datenschutzerklärung gelesen und akzeptiere diese."
				checked={ datenschutzAkzeptiert }
				onChange={ setDatenschutzAkzeptiert }
				required
			/>
			<div className="buttons">
				<button type="submit" disabled={ isSubmitting }>
					Anfrage Absenden
				</button>
			</div>
		</form>
	);
};
