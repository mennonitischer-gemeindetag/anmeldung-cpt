import { useState, useEffect, createContext } from '@wordpress/element';
import Wizzard from './Wizzard';
import {
	PersonalInfo,
	TeilnameTage,
	Workshops,
	Ausfluege,
	Übernachtungen,
	Verpflegung,
	Übersicht,
} from './wizzard-pages';
import apiFetch from '@wordpress/api-fetch';
import {
	transformKinderprogramm,
	transformEssen,
} from './helper/transform-data';
import moment from 'moment';
import Success from './wizzard-pages/Success';
import Failure from './wizzard-pages/Failure';

export const AnmeldungKontext = createContext({});

export default () => {
	const [age, setAge] = useState(18);
	const [workshops, setWorkshops] = useState([]);
	const [ausfluege, setAusfluege] = useState([]);
	const [kinderprogramm, setKinderprogramm] = useState([]);
	const [tickets, setTickets] = useState([]);
	const [essen, setEssen] = useState([]);
	const [successfullSignup, setSuccessfullSignup] = useState(false);
	const [signupError, setSignupError] = useState(null);

	const updateAge = (geb_date) => {
		const newAge = moment('24.05.2020', 'DD.MM.YYYY').diff(
			moment(geb_date, 'DD.MM.YYYY'),
			'years'
		);
		setAge(newAge);
	};

	useEffect(() => {
		(async () => {
			try {
				setWorkshops(
					await apiFetch({
						path: '/wp/v2/workshops?per_page=100&filter[orderby]=meta_value&meta_key=nr',
					})
				);

				setAusfluege(
					await apiFetch({
						path: '/wp/v2/ausfluege?per_page=100&filter[orderby]=meta_value&meta_key=nr',
					})
				);
				setTickets(
					await apiFetch({
						path: '/wp/v2/tickets?per_page=100',
					})
				);
				setEssen(
					await apiFetch({
						path: '/wp/v2/essen?per_page=100',
					})
				);
				setKinderprogramm(
					await apiFetch({
						path: '/wp/v2/kinderprogramm?per_page=100',
					})
				);
			} catch (error) {
				console.error(error);
			}
		})();
	}, []);

	const onSubmit = async (values) => {
		try {
			const response = await apiFetch({
				path: '/gemeindetag/v1/signup',
				method: 'POST',
				body: JSON.stringify(values),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!isNaN(parseInt(response))) {
				setSuccessfullSignup(response);
			}
			console.info(response);
		} catch (error) {
			console.error(error);
			setSignupError(error);
		}
	};

	return (
		<AnmeldungKontext.Provider
			value={{ age, workshops, tickets, ausfluege, kinderprogramm }}
		>
			{signupError ? (
				<Failure error={signupError} />
			) : successfullSignup ? (
				<Success signupID={successfullSignup} />
			) : (
				<Wizzard onSubmit={onSubmit}>
					<PersonalInfo setAge={updateAge} />
					<TeilnameTage
						tickets={tickets}
						kinderprogramm={transformKinderprogramm(kinderprogramm)}
					/>
					<Workshops workshops={workshops} />
					<Ausfluege ausfluege={ausfluege} />
					<Übernachtungen />
					<Verpflegung essen={transformEssen(essen)} />
					<Übersicht
						tickets={tickets}
						kinderprogramm={kinderprogramm}
						workshops={workshops}
						ausfluege={ausfluege}
						essen={essen}
					/>
				</Wizzard>
			)}
		</AnmeldungKontext.Provider>
	);
};
