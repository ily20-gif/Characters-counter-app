let spacesCheckbox = document.querySelector('#spaces')
//if the exclude spaces checkbox changes, throw input event to update counts
spacesCheckbox.addEventListener('change', () => {
    textArea.dispatchEvent(new Event('input'))
})
let limitCheckbox = document.querySelector('#limit')
let limitInput = document.querySelector('#limit-inp')

// Show/hide limit input and set maxlength
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
//toggle the maxlength attr when the limit input changes
limitInput.addEventListener('input', () => {
    if (limitInput.value && limitCheckbox.checked) {
        textArea.setAttribute('maxlength', limitInput.value);
    } else {
        textArea.removeAttribute('maxlength')
    }
})


//dark/light mode toggle
let btnToggle = document.querySelector('.btn')
btnToggle.addEventListener('click',()=>{
    if(document.body.classList.contains('light')){
        document.body.classList.remove('light')
        btnToggle.textContent = 'To Light'
    }else{
        document.body.classList.add('light')
        btnToggle.textContent = 'To Dark'
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
    let phrases = val.split(/\.\s+/)
    if (phrases[phrases.length - 1] === "") {
        phrases.pop()
    }
    return phrases.length
}

function chars(val){
    let arrayChars=[]
    let charsObj = {}
    let total=0
    let valLower=val.toLowerCase()
    if (valLower.length!=0){ 
        for (let ch of valLower){
            let reg = /[A-Z]/ig
            if (reg.test(ch)){
                if (charsObj[ch]){
                    charsObj[ch]++
                    total++
                }else{
                    charsObj[ch] = 1
                    total++
                }
            }   
        }
    }
    for(let ch in charsObj){
        let perc=((charsObj[ch]/total)*100).toFixed(2)
        arrayChars.push({
            letter : ch,
            count : charsObj[ch],
            total : total,
            percentage : perc
        })
    }
    return arrayChars
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

textArea.addEventListener('input', () => {
    let valueText = textArea.value
    if (!valueText) {
        let divERR = document.querySelector('.error')
        divERR.style.display = 'block'
        divERR.textContent = "Veuillez d'abord saisir du texte"
        displayCounts(0, 0, 0)
        document.querySelector('.letter-density').innerHTML = ''
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
    }
})

btnSeeMore.addEventListener('click', () => {
    seeMoreState = !seeMoreState
    let valueText = textArea.value
    let charsObj = chars(valueText)
    updateLetterDensityDisplay(charsObj)
    btnSeeMore.textContent = seeMoreState ? 'See Less' : 'See More'
})

