import React from 'react'
import { formatIncompletePhoneNumber } from 'libphonenumber-js'
import Select from 'react-select'
import CreatableSelect from 'react-select/lib/Creatable'
import { Button, FileUpload, NumeredTextarea } from '../components'
import styles from '../assets/css/partials/Form.module.scss'
import { StringUtil } from '../shared'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { toastMessage } from '../components'

const DATA_TO_CLEAR_INPUT = [
	'label',
	'text',
	'isValid',
	'required',
	'onChange',
	'isEmail',
	'isDate',
	'isPhone',
	'isZipCode',
	'activeMessage',
	'isMobileNumber',
	'isNumber',
	'isCurrency',
	'onBlur',
	'isFormSubmitted',
	'inactiveMessage',
	'onFieldValidate',
	'onComponentMount',
	'onComponentUnmount',
	'isLoading',
	'checked',
	'defaultChecked',
	'val',
	'defaultValue',
	'items',
	'messageOnError',
	'children',
	'linkHref',
	'linkText',
	'classes',
	'submitEventName',
	'labelDangerouslySetInnerHTML'
]

export class FormComponent {
	_form = []

	constructor(form, options = {}) {
		this._form = form
		this.options = options
		this.errors = {}

		if (options.pageRef) {
			this.pageRef = options.pageRef
			if (options.prefix) {
				this.statePrefix = options.prefix
			}
		}

		for (const [key, input] of Object.entries(form)) {
			input.props.id = key

			if (input.props.type === 'button') continue

			if (input.required !== undefined) {
				const _requiredMessage = input.label + ' is required.'
				if (Array.isArray(input.required)) {
					if (input.required[0]) {
						input.requiredMessage = input.required[1]
							? input.required[1]
							: _requiredMessage
						input.required = true
					} else {
						input.required = false
					}
				} else if (input.required) {
					input.requiredMessage = _requiredMessage
				}
			}

			if (!input.props.onChange && options.changeHandler) {
				input.props.onChange = e => {
					options.changeHandler(key, e.target.value)
				}
			}
		}

		return this
	}

	get = () => {
		return this._form
	}

	_renderTextInput = input => {
		return <input key={input.props.id} {...input.props} />
	}

	_renderTextArea = input => {
		return <textarea key={input.props.id} {...input.props} />
	}

	_renderSelect = input => {
		return (
			<Select
				className="select"
				classNamePrefix="select"
				key={input.props.id}
				{...input.props}
				options={input.options}
			/>
		)
	}

	_renderCreatableSelect = input => {
		return (
			<CreatableSelect
				className="select"
				classNamePrefix="select"
				key={input.props.id}
				{...input.props}
				options={input.options}
			/>
		)
	}

	_renderButton = (input, data) => {
		return (
			<Button key={input.props.id} loading={data.loading} {...input.props}>
				{input.label}
			</Button>
		)
	}

	_renderNumeredTextarea = (input, data) => {
		return <NumeredTextarea key={input.props.id} {...input.props} />
	}

	_renderFile = (input, data) => {
		return <FileUpload key={input.props.id} {...input.props} />
	}

	_renderPassword = input => {
		return <input key={input.props.id} {...input.props} />
	}

	_renderPhone = input => {
		return (
			<PhoneInput
				key={input.props.id}
				isValid={(inputNumber, _country, countries) => {
					return countries.some(country => {
						return (
							inputNumber.startsWith(country.dialCode) ||
							country.dialCode.startsWith(inputNumber)
						)
					})
				}}
				defaultCountry={'br'}
				preferredCountries={['br']}
				enableSearchField={true}
				{...input.props}
				inputProps={{
					...input.inputProps
				}}
			/>
		)
	}

	_renderCustom = input => {
		if (input.props.hasOwnProperty('render')) {
			return input.props.render({
				key: input.props.id,
				...input.props
			})
		}
		throw new Error('Missing prop "render" on input id=' + input.props.id)
	}

	renderButton = (id, data) => {
		const input = this._form[id]

		if (!data) data = {}

		return (
			<div className={styles.inputWrapper}>
				{this._renderButton(input, data)}
			</div>
		)
	}

	isEmpty = value => {
		let empty

		switch (typeof value) {
			case 'string':
				empty = StringUtil.isEmpty(value)
				break
			case 'boolean':
				empty = !value
				break
			case 'number':
				empty = false
				break
			case 'object':
				empty = value === null || (Array.isArray(value) && !value.length)
				break
			default:
				empty = !value
				break
		}
		return empty
	}

	getSelectValue = ref => {
		const selected = ref.select.state.selectValue
		if (selected && selected.length) return selected[0].value
		else return null
	}

	renderInput = (id, data) => {
		let input = this._form[id]
		if (!input) {
			throw new Error('Invalid input id=' + id)
		}
		let inputField
		let title

		if (data && data.length) {
			input.props = { ...input.props, ...data }
		}

		if (this.pageRef) {
			if (this.statePrefix) {
				input.props.value = this.pageRef.state[this.statePrefix][id]
			} else {
				input.props.value = this.pageRef.state[id]
			}
		}

		const ref = React.createRef()
		input.props.ref = ref
		input.props.autoComplete = 'off'

		if (input.renderLabel) {
			title = input.renderLabel(input.label)
		} else {
			title = <p key={'pl' + id}>{input.label}</p>
		}

		switch (input.props.type) {
			case 'password':
				inputField = this._renderPassword(input)
				break

			case 'textarea':
				inputField = this._renderTextArea(input)
				break

			case 'numeredTextarea':
				input.getValue = ref => {
					return ref.ref.value
				}
				inputField = this._renderNumeredTextarea(input)
				break

			case 'select':
				input.getValue = this.getSelectValue
				inputField = this._renderSelect(input)
				break

			case 'creatableSelect':
				input.getValue = (ref, input) => {
					return this.getSelectValue(ref.select)
				}
				inputField = this._renderCreatableSelect(input)
				break

			case 'file':
				input.getValue = (ref, input) => {
					return input.props.files
				}
				if (input.props.value) delete input.props.value
				inputField = this._renderFile(input)
				break

			case 'phone':
				input.getValue = ref => {
					return ref.numberInputRef.value
				}
				if (typeof input.valid == 'function') {
					input.validWrapper = (value, input) => {
						const isValid = input.valid(value)
						if (!isValid) this.errors[id] = 'Invalid phone number'
						return isValid
					}
				}
				inputField = this._renderPhone(input)
				break

			case 'date':
				if (typeof input.valid != 'function') {
					input.valid = (value, input) => {
						if (!FormUtil.isDate(value)) {
							this.errors[id] = 'Invalid date'
							return false
						}
						return true
					}
				}
				input.props.type = 'text'
				input.props.placeholder = 'YYYY-mm-dd'
				inputField = this._renderTextInput(input)
				break

			case 'datetime':
				input.getValue = ref => {
					return ref.ref.value
				}
				inputField = this._renderDateTime(input)
				break

			case 'custom':
				input.getValue = ref => {
					return ref.getValue()
				}
				inputField = this._renderCustom(input)
				break

			default:
			case 'email':
			case 'text':
				inputField = this._renderTextInput(input)
				break
		}

		if (!input.getValue) {
			input.getValue = (ref, input) => {
				return ref.value
			}
		}
		if (!input.isEmpty) {
			input.isEmpty = this.isEmpty
		}

		input.wrapper = React.createRef()
		return (
			<div ref={input.wrapper} className={styles.inputWrapper}>
				<label htmlFor={id}>
					{title}
					{inputField}
				</label>
			</div>
		)
	}

	getValue = id => {
		const input = this._form[id]
		const ref = input.props.ref.current

		if (input.getValue) {
			return input.getValue(ref, input)
		}

		if (ref.hasOwnProperty('value')) {
			return ref.value
		}

		throw new Error('Ref has no value property in input id=' + id)
	}

	getLabel = id => {
		const input = this._form[id]
		if (input) {
			return input.label
		}
		throw new Error('Invalid id: ' + id)
	}

	_focus = input => {
		if (input.focus) input.focus()
		else {
			input.props.ref.current.focus()
		}
	}

	setErrorFlag = id => {
		const input = this._form[id]
		if (input) {
			this._setErrorFlag(input)
			this._focus(input)
		}
	}

	_clearErrorFlag = input => {
		input.wrapper.current.className = styles.inputWrapper
	}

	_setErrorFlag = input => {
		let inputClasses = []
		inputClasses.push(styles.error)

		if (this.options.errorClasses)
			inputClasses = [...inputClasses, ...this.options.errorClasses]

		inputClasses.forEach(className => {
			input.wrapper.current.classList.add(className)
		})
	}

	valid = () => {
		let errors = false
		this.errors = {}

		for (const [id, input] of Object.entries(this._form)) {
			if (input.props.type === 'button') continue

			let inputValid = true
			let val
			let ref = input.props.ref.current
			if (!ref) {
				throw new Error('Null ref for input id=' + id)
			}

			if (input.getValue) {
				val = input.getValue(ref, input)
			} else {
				throw new Error('Ref has no value property in input id=' + id)
			}

			if (input.trim && val) {
				if (typeof input.trim == 'function') {
					val = input.trim(val)
				} else if (StringUtil.isString(val)) {
					val = val.trim()
				}
			}

			if (input.isEmpty(val)) {
				if (input.required) {
					this.errors[id] = input.requiredMessage
					inputValid = false
				}
			} else if (typeof input.validWrapper === 'function') {
				if (!input.validWrapper(val, input)) {
					inputValid = false
				}
			} else if (
				typeof input.valid === 'function' &&
				!input.valid(val, input)
			) {
				inputValid = false
			}

			if (!inputValid) {
				errors = true
				this._setErrorFlag(input)
			} else if (input.wrapper.current) {
				this._clearErrorFlag(input)
			}
		}

		for (const [id, error] of Object.entries(this.errors)) {
			console.warn(id + ':', error)
			toastMessage(error)
		}

		return !errors
	}
}

export const FormUtil = {
	clear(data, optionalDataToClear) {
		this._clearData(data, optionalDataToClear, [])
	},

	clearDataInput(data, optionalDataToClear) {
		this._clearData(data, optionalDataToClear, DATA_TO_CLEAR_INPUT)
	},

	commonFieldsValidations(fieldProps, fieldValue) {
		let isInvalid = true

		if (typeof fieldValue === 'string') {
			isInvalid = StringUtil.isEmpty(fieldValue)
		} else if (typeof fieldValue === 'boolean') {
			isInvalid = !fieldValue
		} else if (typeof fieldValue === 'number') {
			isInvalid = false
		}

		if (fieldProps.required && isInvalid) {
			throw new Error(fieldProps.messageOnError)
		}
	},

	parseValueFromProps(props = {}, nextProps = {}) {
		let value = null

		if (nextProps.val !== props.val) {
			value = nextProps.val
		} else if (nextProps.defaultValue !== props.defaultValue) {
			value = nextProps.defaultValue
		}

		return value
	},

	parseAttributeFromProps(props = {}, nextProps = {}, attribute = '') {
		let value

		if (nextProps[attribute] !== props[attribute]) {
			value = nextProps[attribute]
		}

		return value
	},

	parseCheckedFromProps(props = {}, nextProps = {}) {
		let checked = null

		if (nextProps.checked !== props.checked) {
			checked = nextProps.checked // eslint-disable-line prefer-destructuring
		} else if (nextProps.defaultChecked !== props.defaultChecked) {
			checked = nextProps.defaultChecked
		}

		return checked
	},

	isHidden(type) {
		return type === 'hidden'
	},

	isEmail(value) {
		const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g

		return regex.test(value)
	},

	isPhone(value) {
		const regex = /^(\(\d{2}\) \d{4,5}-\d{4})$/g

		return regex.test(value)
	},

	isZipCode(value) {
		const regex = /^(\d{20})$/g

		return regex.test(value)
	},

	isMobileNumber(value) {
		const regex = /^(\d{20})$/g

		return regex.test(value)
	},

	isNumber(value) {
		const regex = /^(\d{0,9})$/g

		return regex.test(value)
	},

	isCurrency(value) {
		const regex = /^(\d{0,9})$/g

		return regex.test(value)
	},

	isDate(value) {
		const regexp = /^(19|20)([0-9]{2}).(0?[1-9]|1[012]).([0-3]?[0-9])$/
		if (!value.match(regexp)) return false
		return !isNaN(new Date(value))
	},

	formatDateTime(date, timeZone = 'UTC') {
		if (!date) return ''
		return date.toJSON()
	},

	formatDate(date, timeZone = 'UTC') {
		let d = FormUtil.formatDateTime(date, timeZone)
		if (!d) return ''
		return d.slice(0, d.indexOf('T'))
	},

	toZipCode(value = '') {
		value = value.replace(/[^\d]/g, '')
		return value
	},

	toMobileNumber(value = '', countryCode) {
		const regex = new RegExp(`^\\+${countryCode}`)

		countryCode = countryCode.toString()

		return formatIncompletePhoneNumber(
			'+' + countryCode + value.replace(/[^\d]/g, '')
		)
			.replace(regex, '')
			.trim()
	},

	toConfirmationCode(value = '') {
		value = value.replace(/[^\d]/g, '')
		return value
	},

	reverseCurrencyFormat(value = '', currency) {
		switch (currency) {
			case 'USD':
			default:
				value = value.replace(',', '')
				break
		}

		return value || ''
	},

	toCurrency(value = '', currency) {
		let integerPart
		const settings = {
			precision: 2
		}

		value = value.toString().replace(/[^\d]/g, '')

		if (value === '') return ''

		if (value.length === 1)
			value = '0000000000'.substring(0, settings.precision) + value

		switch (currency) {
			case 'BRL':
				integerPart = parseInt(
					value.substr(0, value.length - settings.precision)
				)

				if (isNaN(integerPart) || integerPart < 1) integerPart = '0'

				integerPart = integerPart
					.toString()
					.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
				value =
					integerPart +
					',' +
					value.substr(value.length - settings.precision, settings.precision)
				break

			case 'MXN':
			case 'USD':
			default:
				integerPart = parseInt(
					value.substr(0, value.length - settings.precision)
				)

				if (isNaN(integerPart) || integerPart < 1) integerPart = '0'

				integerPart = integerPart
					.toString()
					.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
				value =
					integerPart +
					'.' +
					value.substr(value.length - settings.precision, settings.precision)
				break
		}

		return value
	},

	toPhone(value = '') {
		value = value.replace(/[^\d]/g, '')

		if (value.length > 0) {
			value = '(' + value

			if (value.length > 3) {
				value = [value.slice(0, 3), ') ', value.slice(3)].join('')
			}

			if (value.length > 12) {
				if (value.length > 13)
					value = [value.slice(0, 10), '-', value.slice(10)].join('')
				else value = [value.slice(0, 9), '-', value.slice(9)].join('')
			}

			if (value.length > 15) value = value.substr(0, 15)

			return value
		}

		return ''
	},

	getFieldError(field) {
		let fieldError = null
		const { error, isFieldChanged, isFieldBlurred, value } = field.state
		const { isFormSubmitted } = field.props

		if (isFormSubmitted || (value && (isFieldChanged || isFieldBlurred))) {
			fieldError = error
		}

		return fieldError
	},

	_clearData(data, optionalDataToClear, dataToClear) {
		if (Array.isArray(optionalDataToClear)) {
			dataToClear = dataToClear.concat(optionalDataToClear)
		}

		dataToClear.forEach(remove => {
			delete data[remove]
		})
	},

	setFocusToFirstEmptyField(refs) {
		refs.some(ref => {
			let input = ref ? ref.current : null

			input = input ? input._inputRef : null
			input = input ? input.current : null

			if (
				input &&
				(input.type === 'text' ||
					input.type === 'tel' ||
					input.type === 'email') &&
				!input.value.length
			) {
				input.focus()
				return true
			}

			return false
		})
	}
}
