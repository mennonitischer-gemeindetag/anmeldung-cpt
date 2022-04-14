export default (props) => {
	return (
		<div>
			<h2 className={'section-heading'}>Vielen Dank!</h2>
			<div>
				Deine Anmeldung ({props.signupID}) zum AMG-Gemeindetag 2020 auf
				dem Weierhof ist eingegangen. Du solltest in den nächsten
				Minuten eine E-Mail von{' '}
				<a href="mailto:gemeindetag@mennoniten.de">
					gemeindetag@mennoniten.de
				</a>{' '}
				bekommen.{'\n'}
				Sollte dies nicht der Fall sein, kontrolliere deinen SPAM
				Ordner. Sollte nach 24 Stunden keine E-Mail eingegangen sein,
				wende dich an{' '}
				<a href="mailto:gemeindetag@mennoniten.de">
					gemeindetag@mennoniten.de
				</a>
				.
				<button
					type="button"
					onClick={() => {
						location.reload();
					}}
				>
					Weitere Anmeldung ausfüllen
				</button>
			</div>
		</div>
	);
};
