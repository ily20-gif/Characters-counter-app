let spacesCheckbox = document.querySelector('#spaces')

spacesCheckbox.addEventListener('change', () => {
    textArea.dispatchEvent(new Event('input'))
})
let limitCheckbox = document.querySelector('#limit')
let limitInput = document.querySelector('#limit-inp')


limitCheckbox.addEventListener('change', () => {
    if (limitCheckbox.checked) {
        limitInput.style.display = 'inline'
        if (limitInput.value) {
            textArea.setAttribute('maxlength', limitInput.value);
        }
    } else {
        limitInput.style.display = 'none'
        textArea.removeAttribute('maxlength')
    }
})


limitInput.addEventListener('input', () => {
    if (limitInput.value && limitCheckbox.checked) {
        textArea.setAttribute('maxlength', limitInput.value);
    } else {
        textArea.removeAttribute('maxlength')
    }
})





let btnToggle = document.querySelector('.btn')
btnToggle.addEventListener('click',()=>{
    if(document.body.classList.contains('light')){
        document.body.classList.remove('light')
        document.querySelector('.logo-img').src = './logo-dark-theme.svg'
        document.querySelector('.mode-img').src = './icon-sun.svg'
    }else{
        document.body.classList.add('light')
        document.querySelector('.logo-img').src = './logo-light-theme.svg'
        document.querySelector('.mode-img').src = './icon-moon.svg'
    }
})












function countWords(val) {
    let words = val.split(/\s+|\n+/);
    if (words[words.length - 1] === "") {
        words.pop()
    }
    return words.length
}

function countPhrases(val) {
    let phrases = val.split(/[.!?]+/)
    phrases = phrases.filter(p => p.trim() !== "")
    return phrases.length
}


function chars(val) {
    let charsObj = {}
    let total = 0
    let valLower = val.toLowerCase()

    for (let ch of valLower) {
        if (/[a-z]/i.test(ch)) {
            charsObj[ch] = (charsObj[ch] || 0) + 1
            total++;
        }
    }

    return Object.entries(charsObj).map(([letter, count]) => ({
        letter,
        count,
        total,
        percentage: ((count / total) * 100).toFixed(2)
    }))
}



function displayCounts(ch,wrd,sentc){
    let Char = document.querySelector('.total-ch-nb')
    Char.textContent = ch
    let Words = document.querySelector(".word-nb")
    Words.textContent = wrd
    let sentence = document.querySelector('.sentc-nb')
    sentence.textContent = sentc
}


function displayLetterDensityAll(arrChar){
    let letterDensity = document.querySelector('.letter-density')
    letterDensity.innerHTML=''
    arrChar.forEach(obj=>{
        let divRow = document.createElement('div')
        divRow.classList.add('letter-row')
        let letter = document.createElement('span')
        letter.classList.add('letter')
        letter.textContent = obj.letter.toUpperCase()
        divRow.append(letter)
        let bar = document.createElement('div')
        bar.classList.add('bar')
        let fillDiv = document.createElement('div')
        fillDiv.classList.add('fill')
        fillDiv.style.width = obj.percentage +'%'
        bar.append(fillDiv)
        divRow.append(bar)
        let count = document.createElement('span')
        count.classList.add('count')
        count.textContent = `${obj.count} (${obj.percentage}%)`
        divRow.append(count)
        letterDensity.append(divRow)
    })
}

function displayLetterDensitySome(arrChar){
    let letterDensity = document.querySelector('.letter-density')
    letterDensity.innerHTML=''
    let newArrChr=arrChar.slice(0,5)
    newArrChr.forEach(obj=>{
        let divRow = document.createElement('div')
        divRow.classList.add('letter-row')
        let letter = document.createElement('span')
        letter.classList.add('letter')
        letter.textContent = obj.letter.toUpperCase()
        divRow.append(letter)
        let bar = document.createElement('div')
        bar.classList.add('bar')
        let fillDiv = document.createElement('div')
        fillDiv.classList.add('fill')
        fillDiv.style.width = obj.percentage +'%'
        bar.append(fillDiv)
        divRow.append(bar)
        let count = document.createElement('span')
        count.classList.add('count')
        count.textContent = `${obj.count} (${obj.percentage}%)`
        divRow.append(count)
        letterDensity.append(divRow)
    })
}


let textArea = document.querySelector('textarea')
let btnSeeMore = document.querySelector('.see-more')
let seeMoreState = false


function updateLetterDensityDisplay(charsObj) {
    if (seeMoreState) {
        displayLetterDensityAll(charsObj)
    } else {
        displayLetterDensitySome(charsObj)
    }
}

function readingTime(wordscount) {
    let timeSpan = document.querySelector(".reading-time span");
    if (!wordscount || wordscount === 0) {
        timeSpan.textContent = ""
        return
    }
    let totalSeconds = Math.ceil((wordscount / 200) * 60)
    let minutes = Math.floor(totalSeconds / 60)
    let seconds = totalSeconds % 60
    if (seconds === 0) {
        timeSpan.textContent = `   ${minutes} min ${minutes > 1 ? 's' : ''}`
    } else {
        timeSpan.textContent = `  ${minutes} min ${seconds} sec`
    }
}

textArea.addEventListener('input', () => {
    let valueText = textArea.value
    if (!valueText) {
        let divERR = document.querySelector('.error')
        divERR.style.display = 'block'
        divERR.textContent = "Le champ est vide."
        displayCounts(0, 0, 0)
        document.querySelector('.letter-density').innerHTML = ''
        let timeSpan = document.querySelector('.reading-time span')
        if (timeSpan) timeSpan.textContent = ''
    } else {
        let divERR = document.querySelector('.error')
        divERR.style.display = 'none'
        let incSpaces = document.querySelector('#spaces').checked
        let nbChars = 0
        if (incSpaces) {
            nbChars = valueText.replace(/\s+|\n/gi, "").length
        } else {
            nbChars = valueText.length
        }
        let nbWords = countWords(valueText)
        let nbPhrases = countPhrases(valueText)
        let charsObj = chars(valueText)
        displayCounts(nbChars, nbWords, nbPhrases)
        updateLetterDensityDisplay(charsObj)
        readingTime(nbWords)
    }
})

btnSeeMore.addEventListener('click', () => {
    seeMoreState = !seeMoreState
    let valueText = textArea.value
    let charsObj = chars(valueText)
    updateLetterDensityDisplay(charsObj)
    btnSeeMore.textContent = seeMoreState ? 'See Less' : 'See More'
})

