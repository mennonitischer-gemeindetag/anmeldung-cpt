export default (props) => {
	return (
		<div>
			<h2 className={'section-heading'}>
				Leider ist ein Fehler aufgetreten.
			</h2>
			<div>
				Bitte versuche es in einigen Minuten erneut. Sollte der Fehler
				mehrfach auftreten, melde dich bitte unter folgender
				E-Mail-Adresse bei uns:{' '}
				<a href="mailto:gemeindetag@mennoniten.de">
					gemeindetag@mennoniten.de
				</a>
				. Danke für dein Verständnis!
			</div>
			<h3>Fehlermeldung:</h3>
			<pre>{props.error}</pre>
		</div>
	);
};
