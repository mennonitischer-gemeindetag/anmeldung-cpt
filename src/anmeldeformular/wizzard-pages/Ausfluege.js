import Wizzard from '../Wizzard';
import Card from '../components/Card';
import { transformWorkshops } from '../helper/transform-data';

export default ({ ausfluege }) => {
	const transformedAusfluege = transformWorkshops(ausfluege);
	return (
		<Wizzard.Page>
			<h2 className={'section-heading'}>Ausflüge</h2>
			<p>
				Deine Anmeldung ist verbindlich, aber das Anmeldeteam behält
				sich vor kurzfristig Änderungen vorzunehmen. Bitte achte darauf,
				dass sich die Workshops und Ausflüge zeitlich nicht
				überschneiden.
			</p>
			{transformedAusfluege &&
				Object.keys(transformedAusfluege)
					.reverse()
					.map((tag) => (
						<div className={`Ausfluege-${tag}`}>
							<h3>{tag}</h3>
							<div className="ausfluege-list">
								{transformedAusfluege[tag]
									.reverse()
									.map((ausflug) => (
										<Card
											key={ausflug.id}
											{...ausflug}
											fieldGroup={'ausfluege'}
										/>
									))}
							</div>
						</div>
					))}
		</Wizzard.Page>
	);
};
