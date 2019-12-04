import Wizzard from '../Wizzard';
import { Field, useFormState } from 'react-final-form';
import Table, { TableRow, TableHeader, TableFooter } from '../components/Table';
import { getPrice } from '../wizzard-pages/TeilnameTage';
import { useContext } from '@wordpress/element';
import { AnmeldungKontext } from '../Anmeldeformular';
import calculateLatePayment from '../helper/calculate-late-payment';

const addierer = ( key = 'price' ) => ( summe, item ) => {
	if ( ! item.meta[ key ] && ! isNaN( item.meta[ key ] ) ) {
		return summe;
	}
	return summe + parseInt( item.meta[ key ] );
};

export default ( props ) => {
	const { workshops, ausfluege, tickets, essen, kinderprogramm } = props;

	const { values } = useFormState();
	const { age } = useContext( AnmeldungKontext );

	const selectedworkshops = values.workshops ?
		workshops.filter( ( workshop ) =>
			values.workshops.some( ( item ) => item == workshop.id )
		) :
		[];
	const selectedausfluege = values.ausfluege ?
		ausfluege.filter( ( ausflug ) =>
			values.ausfluege.some( ( item ) => item == ausflug.id )
		) :
		[];
	const selectedessen = values.verpflegung ?
		essen.filter( ( speise ) => values.verpflegung.some( ( item ) => item == speise.id ) ) :
		[];
	const selectedkinderprogramm = values.kinderprogramm ?
		kinderprogramm.filter( ( kinderprog ) =>
			values.kinderprogramm.some( ( item ) => item == kinderprog.id )
		) :
		[];

	const selectedTickets = values.teilnahmetage ?
		tickets.filter( ( ticket ) => {
			debugger;
			return values.teilnahmetage.some( ( item ) => item == ticket.id );
		} ) :
		[];

	const late_payment_aufschlag = calculateLatePayment();
	const isFreeKidMeal = age <= 9;

	const betrag =
    parseInt( selectedworkshops.reduce( addierer( 'preis' ), 0 ) ) +
    parseInt( selectedausfluege.reduce( addierer( 'preis' ), 0 ) ) +
    ( isFreeKidMeal ? 0 : parseInt( selectedessen.reduce( addierer( 'price' ), 0 ) ) ) +
    parseInt(
    	selectedTickets.reduce( ( summe, ticket ) => {
    		return summe + parseInt( getPrice( ticket, age ) );
    	}, 0 )
    ) +
    parseInt( values.uebernachtung_and_breakfast ? 15 : 0 ) +
    parseInt( late_payment_aufschlag );

	return (
		<Wizzard.Page>
			<h2 className={ 'section-heading' }>Übersicht</h2>
			<p>
				{ values.vorname } { values.nachname }
				<br />
				{ values.adresse_straße }
				<br />
				{ values.adresse_plz } { values.adresse_ort }
				<br />
				{ values.email }
				<br />
				{ values.telefonnummer }
			</p>

			<Table>
				<TableHeader title={ 'Titel' } price={ 'Preis' } />
				{ selectedTickets.map( ( ticket ) => (
					<TableRow
						title={ ticket.title.rendered }
						price={ getPrice( ticket, age ) }
					/>
				) ) }
				{ selectedworkshops.map( ( workshop ) => (
					<TableRow
						title={ `${ workshop.meta.character }${ workshop.meta.nr } - ${ workshop.title.rendered }` }
						price={ workshop.meta.preis }
					/>
				) ) }
				{ selectedausfluege.map( ( ausflug ) => (
					<TableRow
						title={ `${ ausflug.meta.character }${ ausflug.meta.nr } - ${ ausflug.title.rendered }` }
						price={ ausflug.meta.preis }
					/>
				) ) }
				{ selectedessen.map( ( essen ) => (
					<TableRow
						title={ `${ essen.title.rendered }` }
						price={ isFreeKidMeal ? 0 : essen.meta.price }
					/>
				) ) }
				{ !! values.uebernachtung_and_breakfast && (
					<TableRow title={ `Jugend-Übernachtung & Frühstück` } price={ 15 } />
				) }
				{ !! late_payment_aufschlag && (
					<TableRow
						title={ `Spätbucher aufschlag` }
						price={ late_payment_aufschlag }
					/>
				) }
				<TableFooter title="Summe" price={ betrag } />
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
          ) zur Kenntnis genommen und bin damit einverstanden, dass die von mir
          angegebenen Daten elektronisch erhoben und gespeichert werden. Meine
          Daten werden dabei nur streng zweckgebunden im Rahmen der Anmeldung
          sowie der anschließenden Durchführung und Abwicklung des
          Mennonitischen Gemeindetags 2020 genutzt. Mit dem Absenden des
          Anmeldeformulars erkläre ich mich mit der Verarbeitung einverstanden.
				</label>
			</div>
			<br />
			<p>
        Für den Gemeindetag werden wir ein Programmheft und ein Liederheft
        papiergebunden und elektronisch im PDF-Format zur Verfügung stellen.
        Bitte teilt uns nachstehend mit, welches Format ihr bevorzugt.
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
				<label htmlFor="gedrucktes_liederheft">Liederheft in Papierform</label>
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
		</Wizzard.Page>
	);
};
