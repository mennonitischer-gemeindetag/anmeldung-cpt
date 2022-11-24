import Wizard from '../Wizard';
import { Field, useFormState } from 'react-final-form';
import Table, { TableRow, TableHeader, TableFooter } from '../components/Table';
import { getTicketPrice } from './TeilnameTage';
import { useContext } from '@wordpress/element';
import { AnmeldungKontext } from '../Anmeldeformular';
import calculateLatePayment from '../helper/calculate-late-payment';
import calculateTotalPrice from '../helper/calculate-total-price';
import { WP_REST_API_Workshop, WP_REST_API_Ausfluege, WP_REST_API_Tickets, WP_REST_API_Essen } from '../types';

interface OverviewProps {
	workshops: Array<WP_REST_API_Workshop>,
	ausfluege: Array<WP_REST_API_Ausfluege>,
	tickets: Array<WP_REST_API_Tickets>,
	essen: Array<WP_REST_API_Essen>,
}

type SignUpFormState = {
	workshops: Number[],
	ausfluege: Number[],
	verpflegung: Number[],
	teilnahmetage: Number[],
	uebernachtung_and_breakfast: Boolean,
	vorname: string,
	nachname: string,
	adresse_straße: string,
	adresse_plz: string,
	adresse_ort: string,
	email: string,
	telefonnummer: string,
}

const isIdInList = ( list ) => ( item ) => Array.isArray(list) ? list.some( ( id ) => id == item.id ) : [];

export default function Overview( props: OverviewProps ) {
	const { workshops, ausfluege, tickets, essen } = props;

	const { values } = useFormState<SignUpFormState>();
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

	const latePaymentPrice = calculateLatePayment();
	const isFreeKidMeal = age <= 9;

	const totalPrice = calculateTotalPrice( {
		workshops: selectedWorkshops,
		trips: selectedTrips,
		food: selectedFood,
		tickets: selectedTickets,
		sleepingOnSite: isSleepingOnSite,
		age,
	} );

	return (
		<Wizard.Page>
			<h2 className={ 'section-heading' }>Übersicht</h2>
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
				{ selectedFood.map( ( essen ) => (
					<TableRow
						key={ essen.id }
						title={ `${ essen.title.rendered }` }
						price={ isFreeKidMeal ? 0 : essen.meta.price }
					/>
				) ) }
				{ !! isSleepingOnSite && (
					<TableRow
						key={'youth-breakfast'}
						title={ `Jugend-Übernachtung & Frühstück` }
						price={ 15 }
					/>
				) }
				{ !! latePaymentPrice && (
					<TableRow
						key={'late-payment-cost'}
						title={ `Spätbucher Aufschlag` }
						price={ latePaymentPrice }
					/>
				) }
				<TableFooter title="Summe" price={ totalPrice } />
			</Table>
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
					Mennonitischen Gemeindetags 2020 genutzt. Mit dem Absenden
					des Anmeldeformulars erkläre ich mich mit der Verarbeitung
					einverstanden.
				</label>
			</div>
			<br />
			<p>
				Für den Gemeindetag werden wir ein Programmheft und ein
				Liederheft papiergebunden und elektronisch im PDF-Format zur
				Verfügung stellen. Bitte teilt uns nachstehend mit, welches
				Format ihr bevorzugt.
			</p>
			<div>
				<Field
					id="gedrucktes_programmheft"
					name="gedrucktes_programmheft"
					component="input"
					type="checkbox"
				/>
				<label htmlFor="gedrucktes_programmheft">
					Programmheft in Papierform
				</label>
			</div>
			<div>
				<Field
					id="gedrucktes_liederheft"
					name="gedrucktes_liederheft"
					component="input"
					type="checkbox"
				/>
				<label htmlFor="gedrucktes_liederheft">
					Liederheft in Papierform
				</label>
			</div>
			<br />
			<div>
				<Field
					id="daten_fuer_mitfahrgelegenheit_teilen"
					name="daten_fuer_mitfahrgelegenheit_teilen"
					value="agree"
					component="input"
					type="checkbox"
				/>
				<label htmlFor="daten_fuer_mitfahrgelegenheit_teilen">
					Daten für Mitfahrgelegenheiten teilen
				</label>
			</div>
		</Wizard.Page>
	);
};
