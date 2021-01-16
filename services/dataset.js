import AsyncStorage from '@react-native-async-storage/async-storage'
import { isEmpty } from 'lodash'
import { DateUtil } from '../shared/date'

// const { GoogleSpreadsheet } = require('google-spreadsheet')
// import { RequestUtil } from './'

export class DatasetService {
	static getInstance() {
		if (!DatasetService.instance) {
			console.debug('new instance')
			DatasetService.instance = new DatasetService()
		}
		return DatasetService.instance
	}

	constructor() {
		this.searchName = ''
		this.searchAddress = ''

		this.machines = []
		const p1 = AsyncStorage.getItem('machines').then(data => {
			if (data) this.machines = JSON.parse(data)
		})

		this.places = []
		const p2 = AsyncStorage.getItem('places').then(data => {
			if (data) {
				this.places = JSON.parse(data, DateUtil.JSONDateParser)

				//console.log('places storage', JSON.stringify(this.places, null, 4))
				//console.log('typexx', typeof this.places[0].collects[0].date)
			}
			else console.log('places storage empty')
		}).catch(() => console.log('places storage error'))

		this.allocations = []
		const p3 = AsyncStorage.getItem('allocations').then(data => {
			if (data) this.allocations = JSON.parse(data)
		})

		this.selected = []
		const p4 = AsyncStorage.getItem('selectedPlaces').then(data => {
			if (data) this.selected = JSON.parse(data)
		})

		/* this.collects = []
		const p5 = AsyncStorage.getItem('collects').then(data => {
			if (data) this.collects = JSON.parse(data)
		}) */

		// Promise.all([p1, p2, p3, p4]).then(() => this.updateHomeData(1))
		Promise.all([p1, p2, p3, p4]).then(() => this.updateHomeData(1))
	}

	setFilter(name, address) {
		this.searchName = name
		this.searchAddress = address
	}
	getSearchNameFilter() {
		return this.searchName
	}
	getSearchAddressFilter() {
		return this.searchAddress
	}

	getSelected() {
		console.debug('dataset get selected', this.selected)
		return this.selected
	}

	setSelected(selected) {
		this.selected = selected
		AsyncStorage.setItem('selectedPlaces', JSON.stringify(this.selected))
	}
	/**
	 * fill home screen data
	 * called after places changes
	 */
	updateHomeData(start = false) {
		this.data = []
		console.debug('start is ', start)
		if (!this.places || !this.places.length) {
			console.debug('places is empty')
			return []
		}
		for (let i = 0; i < this.places.length; i++) {
			this.data[i] = { ...this.places[i] }
		}
	}

	getData(_params = {}) {
		if (!this.data || !this.data.length) {
			console.debug('data is empty')
			return []
		}
		// return this.getRemoteInfo(params, settings)
		for (let index = 0; index < this.data.length; index++) {
			console.debug('collectzz', this.data[index]['lastCollect'])
			this.data[index]['last'] = this.data[index]['lastCollect'] !== 0 && DateUtil.isValidDate(this.data[index]['lastCollect'])
				? Math.floor(DateUtil.diffInDays(Date.now, this.data[index]['lastCollect']))
				: 1000
		}
		//console.log('this.data', JSON.stringify(this.data, null, 4))

		return this.data
	}

	addMachine(keyCode, description = '') {
		if (!isEmpty(keyCode)) {
			const lastId = this.machines.length
				? this.machines[this.machines.length - 1].id
				: 0
			this.machines.push({
				id: lastId + 1,
				keyCode: keyCode,
				description: description
			})
			console.debug('machine added: code=', keyCode, 'desc=', description)
			AsyncStorage.setItem('machines', JSON.stringify(this.machines))
		}
	}
	getMachineList() {
		return this.machines
	}
	addPlace(name, address, reminder) {
		if (isEmpty(name) || isEmpty(address)) return false
		const lastId = this.places.length
			? this.places[this.places.length - 1].id
			: 0
		this.places.push({
			id: lastId + 1,
			name: name,
			address: address,
			reminder: reminder,
			lastCollect: 0,
			collects: []
		})
		console.debug('place added: name=', name, 'address=', address)
		AsyncStorage.setItem('places', JSON.stringify(this.places))

		this.updateHomeData()
		return true
	}

	/* fetch(params) {
		RequestUtil.get('/places', params)
	} */
	addCollect(localId, date, total, commission, reminder) {
		const placeIndex = this.places.findIndex(e => e.id === localId)
		if (placeIndex < 0) return false
		console.debug('addCollect', typeof date, date)

		const length = this.places[placeIndex].collects.length
		const lastId = length ? this.places[placeIndex].collects[length - 1].id : 0

		this.places[placeIndex].collects.push({
			id: lastId + 1,
			date: new Date(date),
			total: total,
			commission: commission,
			reminder: reminder
		})
		if (date > this.places[placeIndex].lastCollect) {
			this.places[placeIndex].lastCollect = new Date(date)
		}
		console.debug(
			'collected: local=',
			localId,
			'date=',
			date,
			'total=',
			total,
			'commission=',
			commission,
			'reminder=',
			reminder
		)
		AsyncStorage.setItem('places', JSON.stringify(this.places))
		// AsyncStorage.setItem('collects', JSON.stringify(this.collects))

		this.updateHomeData()
		//this.updateCollectData()

		return true
	}

	getCollectData(_beginDate, _endDate = '2100-01-01') {
		let beginDate
		if (!DateUtil.isValidDate(_beginDate)) {
			beginDate = new Date()
			beginDate.setMonth(beginDate.getMonth() - 3)
		} else {
			beginDate = new Date(_beginDate.toDateString())
		}
		let endDate = new Date(_endDate.toDateString())
		endDate.setDate(endDate.getDate() + 1)
		if (
			!this.beginDate || this.beginDate.getTime() != beginDate.getTime() ||
			!this.endDate || this.endDate.getTime() != endDate.getTime()
		) {
			this.beginDate = new Date(beginDate)
			this.endDate = new Date(endDate)
		}
		this.updateCollectData()

		return this.collectData
	}

	updateCollectData() {
		// spreadsheet key is the long id in the sheets URL
		/*const doc = new GoogleSpreadsheet('1yWUXCnaRpYRE3nTmPhXKhoUGrdJ-UrH2JLs5lD9WOjE');

		// use service account creds
		/* await doc.useServiceAccountAuth({
			client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
			private_key: process.env.GOOGLE_PRIVATE_KEY,
		}); *
		// OR load directly from json file if not in secure environment
		await doc.useServiceAccountAuth(require('./credentials.json'));
		// OR use service account to impersonate a user (see https://developers.google.com/identity/protocols/oauth2/service-account#delegatingauthority)
		//await doc.useServiceAccountAuth(require('./creds-from-google.json'), 'some-user@my-domain.com');
		// OR use a pre-configured Google OAuth2Client (check the Authentication docs for more info)
		//doc.useOAuth2Client(oAuth2Client);
		// OR use API key -- only for read-only access to public sheets
		//doc.useApiKey('YOUR-API-KEY');

		/* await doc.loadInfo(); // loads document properties and worksheets
		console.log(doc.title);
		await doc.updateProperties({ title: 'renamed doc' });

		const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
		//console.log(sheet.title);
		//console.log(sheet.rowCount);

		// adding / removing sheets
		//const newSheet = await doc.addSheet({ title: 'hot new sheet!' });
		//await newSheet.delete();

		// read rows
		//const rows = await sheet.getRows(); // can pass in { limit, offset }
		
		/* this.collects.push({
			id: lastId + 1,
			local: localId,
			date: date,
			total: total,
			commission: commission,
			reminder: reminder
		}) */
		//this.collects.sort((a, b) => (a.date < b.date)).forEach(e => {
		//primriro achar a row do local

		//e so salvar cada data na rrspectiva celula

		//});

		console.debug('updating collect Data begin=', this.beginDate, 'end=', this.endDate)

		if (!DateUtil.isValidDate(this.beginDate) || !DateUtil.isValidDate(this.endDate)) {
			console.debug('dates not valid')
			return
		}

		let monthRange = DateUtil.createMonthRange(this.beginDate, this.endDate)
		this.collectData = {
			placesColumn: [],
			monthNames: monthRange.map(e => e.label),
			values: []
		}
		this.collectData.monthNames.push('Totais')

		this.orderedPlaces = this.places.sort((a, b) =>
			a.name < b.name ? -1 : a.name > b.name ? 1 : 0
		)

		console.debug('this.placesoo', this.orderedPlaces)
		//.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
		let monthTotals = {
			totals: new Array(monthRange.length + 1).fill(0.0),
			commissions: new Array(monthRange.length + 1).fill(0.0),
			liqs: new Array(monthRange.length + 1).fill(0.0)
		}
		this.orderedPlaces.forEach(place => {
			this.collectData.placesColumn.push(place.name)
			let filteredCollects = place.collects.filter(
				c => {
					// console.debug('filtering collect c=', c, 'with c.date between', this.beginDate, this.endDate)
					// console.debug('type c.date', typeof c.date)
					return c.date >= this.beginDate && c.date <= this.endDate
				}
			)
			// console.debug('orderedPlace', place, 'filteredCollects=', this.beginDate, this.endDate, JSON.stringify(filteredCollects, null, 4))

			let placeTotal = 0.0, // sum total in all months for a given place
				placeCommission = 0.0, // same as above for commision
				placeLiq = 0.0, // liquido
				rowResult = { totals: [], commissions: [], liqs: [] }

			for (let mindex = 0; mindex < monthRange.length; mindex++) {
				const m = monthRange[mindex]
				let total = 0.0, commission = 0.0, liq = 0.0
				// each month, pick values from corresponding date interval and sum those values,
				// push the calculated totals to the result array
				filteredCollects.forEach(c => {
					if (c.date >= m.begin && c.date <= m.end) {
						total += c.total
						commission += c.commission
						liq += c.total - c.commission
					}
				})
				// rowResult.push({ total: total, commission: commission })
				rowResult.totals.push(total)
				rowResult.commissions.push(commission)
				rowResult.liqs.push(liq)
				placeTotal += total
				placeCommission += commission
				placeLiq += liq
				//monthTotals[mindex] = { total: total, commission: commission }
				monthTotals.totals[mindex] += total
				monthTotals.commissions[mindex] += commission
				monthTotals.liqs[mindex] += liq
			}

			rowResult.totals.push(placeTotal)
			rowResult.commissions.push(placeCommission)
			rowResult.liqs.push(placeLiq)
			this.collectData.values.push(rowResult)
		})
		console.debug('monthTotals', monthTotals)
		for (let index = 0; index < monthRange.length; index++) {
			monthTotals.totals[monthRange.length] += monthTotals.totals[index]
			monthTotals.commissions[monthRange.length] += monthTotals.commissions[index]
			monthTotals.liqs[monthRange.length] += monthTotals.liqs[index]
		}
		console.debug('totalxx', monthTotals)
		this.collectData.placesColumn.push('Totals')
		this.collectData.values.push(monthTotals)
		// console.debug('here3', this.collectData.values)
	}
}
