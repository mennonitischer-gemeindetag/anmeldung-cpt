import moment from 'moment';

export default function calculateLatePayment() {
	const firstStage = moment('01.03.2020', 'DD.MM.YYYY');
	const secondStage = moment('15.04.2020', 'DD.MM.YYYY');
	const now = moment();

	let fee = 0;

	if (firstStage.isBefore(now)) {
		fee = 10;
	}
	if (secondStage.isBefore(now)) {
		fee = 20;
	}

	now.format('DD.MM.YYYY'); //?

	return fee;
}
