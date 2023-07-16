const calculate = (n1, operator, n2) => {
    const firstNum = parseFloat(n1)
    const secondNum = parseFloat(n2)
    if (operator === 'add') return firstNum + secondNum
    if  (operator === 'subtract') return firstNum - secondNum
    if (operator === 'multiply') return firstNum * secondNum
    if  (operator === 'divide') return firstNum / secondNum
}

const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator__keys');
const display = document.querySelector('.calculator__display');

const getKeyType = (key) => {
    const { action } = key.dataset
    if (!action) return 'number'
    if (
        action === 'add' ||
        action === 'subtract' ||
        action === 'multiply' ||
        action === 'divide'
    ) return 'operator'
    return action
}

const createResultString = (key, displayedNum, state) => {
    //Variables required are:
    // 1. keyContent
    // 2. displayedNum
    // 3. previousKeyType
    // 4. action
    // 5. calculator.dataset.firstValue
    // 6. calculator.dataset.operator
    // 7. calculator.dataset.modValue
    const keyContent = key.textContent
    const keyType = getKeyType(key)
    const {
        firstValue,
        modValue,
        operator,
        previousKeyType
    } = state

    //hits number
    if (keyType === 'number') {
        return displayedNum === '0' ||
            previousKeyType === 'operator' ||
            previousKeyType === 'calculate'
            ? keyContent
            : displayedNum + keyContent
    }

    //hits decimal
    if (keyType === 'decimal') {
        if  (displayedNum.includes('.')) return displayedNum + '.'
        if (previousKeyType === 'operator' || previousKeyType === 'calculate') return '0.'
        return displayedNum 
    }

    //hits operator
    if (keyType === 'operator') {
        const firstValue = calculator.dataset.firstValue
        const operator = calculator.dataset.operator

        return firstValue &&
            operator &&
            previousKeyType !== 'operator' &&
            previousKeyType !== 'calculate'
            ? calculate(firstValue, operator, displayedNum)
            : displayedNum 
    }

    //hits clear
    if (keyType === 'clear') return '0'

    //hits calculate
    if (keyType === 'calculate') {
        let firstValue = calculator.dataset.firstValue
        const operator = calculator.dataset.operator
        let secondValue = displayedNum

        return firstValue
            ? previousKeyType === 'calculate'
                ? calculate(displayedNum, operator, modValue)
                : calculate(firstValue, operator, displayedNum)
            : displayedNum
    }
}

const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
    //Variables and properties needed
    // 1. key
    // 2. calculator
    // 3. calculatedValue
    // 4. displayedNum
    // 5. modValue

    const keyType = getKeyType(key)
    calculator.dataset.previousKeyType = keyType

    if (keyType === 'operator') {
        calculator.dataset.operator = key.dataset.action
        calculator.dataset.firstValue = firstValue &&
            operator &&
            previousKeyType !== 'operator' &&
            previousKeyType !== 'calculate'
            ? calculatedValue
            : displayedNum
    }

    if (keyType === 'clear') {
        if (key.textContent === 'AC') {
            calculator.dataset.firstValue = ''
            calculator.dataset.modValue = ''
            calculator.dataset.operator = ''
            calculator.dataset.previousKeyType = ''
        }
    }

    if (keyType === 'calculate') {
        calculator.dataset.modValue = firstValue && previousKeyType === 'calculate'
            ? modValue
            : displayedNum
    }
}

const updateVisualState = (key, calculator) => {
    const keyType = getKeyType(key)
    Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))

    if (keyType === 'operator') key.classList.add('is-depressed')

    if (keyType === 'clear' && key.textContent !== 'AC') {
        key.textContent = 'AC'
    }
    
    if (keyType !== 'clear') {
        const clearButton = calculator.querySelector('[data-action=clear]')
        clearButton.textContent = 'CE'
    }
}

keys.addEventListener('click', e => {
    if (e.target.matches('button')) return
    const key = e.target
    const displayedNum = display.textContent


    //Pure function
    const resultString = createResultString(key, displayedNum, calculator.dataset)

    //Update states
    display.textContent = resultString
    updateCalculatorState(key, calculator, resultString, displayedNum)
    updateVisualState(key, calculator)
})
