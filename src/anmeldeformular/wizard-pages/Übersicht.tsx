/* eslint-disable camelcase */
import Wizard from '../Wizard';
import { Field, useFormState } from 'react-final-form';
import Table, { TableRow, TableHeader, TableFooter } from '../components/Table';
import { getTicketPrice } from './TeilnameTage';
import { useContext, useRef, useEffect } from '@wordpress/element';
import { AnmeldungKontext } from '../Anmeldeformular';
import calculateTotalPrice from '../helper/calculate-total-price';
import {
	WP_REST_API_Workshop,
	WP_REST_API_Ausfluege,
	WP_REST_API_Tickets,
	WP_REST_API_Essen,
} from '../types';

interface OverviewProps {
	workshops: Array< WP_REST_API_Workshop >;
	ausfluege: Array< WP_REST_API_Ausfluege >;
	tickets: Array< WP_REST_API_Tickets >;
	essen: Array< WP_REST_API_Essen >;
}

type SignUpFormState = {
	workshops: Number[];
	ausfluege: Number[];
	verpflegung: Number[];
	teilnahmetage: Number[];
	uebernachtung_and_breakfast: Boolean;
	vorname: string;
	nachname: string;
	adresse_straße: string;
	adresse_plz: string;
	adresse_ort: string;
	email: string;
	telefonnummer: string;
};

const isIdInList = ( list ) => ( item ) =>
	Array.isArray( list )
		? list.some( ( id ) => Number( id ) === Number( item.id ) )
		: false;

export default function Overview( props: OverviewProps ) {
	const { workshops, ausfluege, tickets, essen } = props;

	const { values } = useFormState< SignUpFormState >();
	const { age } = useContext( AnmeldungKontext );

	const {
		workshops: workshopIds,
		ausfluege: tripIds,
		verpflegung: foodIds,
		teilnahmetage: ticketIds,
		uebernachtung_and_breakfast: isSleepingOnSite,
		vorname: name,
		nachname: surname,
		adresse_straße: street,
		adresse_plz: zipCode,
		adresse_ort: town,
		email: email,
		telefonnummer: phone,
	} = values;

	const selectedWorkshops = workshops.filter( isIdInList( workshopIds ) );
	const selectedTrips = ausfluege.filter( isIdInList( tripIds ) );
	const selectedFood = essen.filter( isIdInList( foodIds ) );
	const selectedTickets = tickets.filter( isIdInList( ticketIds ) );

	const totalPrice = calculateTotalPrice( {
		workshops: selectedWorkshops,
		trips: selectedTrips,
		food: selectedFood,
		tickets: selectedTickets,
		age,
	} );

	const headingRef = useRef( null );
	useEffect( () => {
		if ( headingRef.current ) {
			headingRef.current.scrollIntoView();
		}
	}, [] );

	return (
		<Wizard.Page>
			<h2 ref={ headingRef } className={ 'section-heading' }>
				Übersicht
			</h2>
			<p>
				{ name } { surname }
				<br />
				{ street }
				<br />
				{ zipCode } { town }
				<br />
				{ email }
				<br />
				{ phone }
			</p>

			<Table>
				<TableHeader title={ 'Titel' } price={ 'Preis' } />
				{ selectedTickets.map( ( ticket ) => (
					<TableRow
						key={ ticket.id }
						title={ ticket.title.rendered }
						price={ getTicketPrice( ticket, age ) }
					/>
				) ) }
				{ selectedWorkshops.map( ( workshop ) => (
					<TableRow
						key={ workshop.id }
						title={ `${ workshop.meta.character }${ workshop.meta.nr } - ${ workshop.title.rendered }` }
						price={ workshop.meta.preis }
					/>
				) ) }
				{ selectedTrips.map( ( ausflug ) => (
					<TableRow
						key={ ausflug.id }
						title={ `${ ausflug.meta.character }${ ausflug.meta.nr } - ${ ausflug.title.rendered }` }
						price={ ausflug.meta.preis }
					/>
				) ) }
				{ selectedFood.map( ( selectedEssen ) => (
					<TableRow
						key={ selectedEssen.id }
						title={ `${ selectedEssen.title.rendered }` }
						price={ selectedEssen.meta.price }
					/>
				) ) }
				{ !! isSleepingOnSite && (
					<TableRow
						key={ 'youth-breakfast' }
						title={ `Massenlager inkl. Frühstück von Freitag (28.04.2023) bis Montag (01.05.2023)` }
						price={ 15 }
					/>
				) }
				<TableFooter title="Summe" price={ totalPrice } />
			</Table>
			<div>
				<label htmlFor="bemerkung">Bemerkung</label>
				<Field
					id="bemerkung"
					name="bemerkung"
					component="textarea"
					placeholder="Bemerkung"
				/>
			</div>
			<div>
				<Field
					id="datenschutz"
					name="datenschutz_akzeptiert"
					component="input"
					type="checkbox"
					required={ true }
				/>
				<label htmlFor="datenschutz">
					Ich habe die Datenschutzerklärung (
					<a href="https://gemeindetag.mennoniten.de/datenschutz/">
						https://gemeindetag.mennoniten.de/datenschutz/
					</a>
					) zur Kenntnis genommen und bin damit einverstanden, dass
					die von mir angegebenen Daten elektronisch erhoben und
					gespeichert werden. Meine Daten werden dabei nur streng
					zweckgebunden im Rahmen der Anmeldung sowie der
					anschließenden Durchführung und Abwicklung des
					Mennonitischen Gemeindetags 2023 genutzt. Mit dem Absenden
					des Anmeldeformulars erkläre ich mich mit der Verarbeitung
					einverstanden.
				</label>
			</div>
		</Wizard.Page>
	);
}
