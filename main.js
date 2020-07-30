let comicses
const url = "comicses.json"

fetch(url).then(function (response) {
    response.json().then(function (json) {
        comicses = json
        initialize()
    })
})



function initialize() {
    const category = document.querySelector('#category')
    const search = document.querySelector('#search')
    const button = document.querySelector('button')
    const main = document.querySelector('.main__section')
    const basket = document.querySelector('.basket')

    let sumBasket = 0


    let lastCategory = category.value
    let lastSearch = ''

    let categoryGroup = []
    let finalGroup = []

    finalGroup = comicses

    updateDisplay()

    categoryGroup = []
    finalGroup = []

    button.onclick = selectCategory;

    function selectCategory(e) {
        e.preventDefault()

        categoryGroup = []
        finalGroup = []

        if (category.value === lastCategory && search.value.trim() === lastSearch) {
            return
        } else {
            lastCategory = category.value
            lastSearch = search.value.trim()

            if (category.value === 'Все') {
                categoryGroup = comicses
                selectComics()
            } else {
                let lowerCaseType = category.value.toLowerCase()
                for (let i = 0; i < comicses.length; i++) {
                    if (comicses[i].type === lowerCaseType) {
                        categoryGroup.push(comicses[i])
                    }
                }
                selectComics()
            }
        }
    }



    function selectComics() {

        if (search.value.trim() === '') {
            finalGroup = categoryGroup;
            updateDisplay();
        } else {
            var lowerCaseSearch = search.value.trim().toLowerCase();
            for (var i = 0; i < categoryGroup.length; i++) {
                if (categoryGroup[i].name.indexOf(lowerCaseSearch) !== -1) {
                    finalGroup.push(categoryGroup[i]);
                }
            }
            updateDisplay();
        }
    }




    function updateDisplay() {
        while (main.firstChild) {
            main.removeChild(main.firstChild)
        }

        if (finalGroup.length == 0) {
            const para = document.createElement('p')
            para.textContent = 'Комиксов не найдено!'
            main.appendChild(para)
        } else {
            for (let i = 0; i < finalGroup.length; i++) {
                fetchBlob(finalGroup[i])
            }
        }
    }

    function fetchBlob(comics) {
        let imageurl = 'img/' + comics.imagepath

        fetch(imageurl).then(function (response) {
            response.blob().then(function (blob) {
                let objectURL = URL.createObjectURL(blob)

                showcomicses(objectURL, comics)
            })
        })
    }


    function showcomicses(objectURL, comics) {
        let section = document.createElement('div')
        let heading = document.createElement('h2')
        let para = document.createElement('p')
        let image = document.createElement('img')
        let tobasket = document.createElement('button')
        let basket = document.querySelector('.basket__block')


        section.setAttribute('class', 'section')
        heading.textContent = comics.name
        para.textContent = comics.price + ' грн.'
        image.src = objectURL
        image.alt = comics.name
        tobasket.textContent = 'Добавить в корзину'

        main.appendChild(section)
        section.appendChild(heading)
        section.appendChild(para)
        section.appendChild(image)
        section.appendChild(tobasket)


        let SumEl = document.querySelector('.sumBasket')
        SumEl.textContent = 'Общая сумма: ' + sumBasket + ' грн.'

        tobasket.onclick = function () {
            let basketElement = document.createElement('h2')
            let basketbutton = document.createElement('button')

            basketElement.textContent = comics.name + ' (' + comics.price + ' грн.)'
            basketbutton.textContent = 'удалить из корзины'

            basket.appendChild(basketElement)
            basket.appendChild(basketbutton)

            sumBasket = sumBasket + comics.price
            let SumEl = document.querySelector('.sumBasket')
            SumEl.textContent = 'Общая сумма: ' + sumBasket + ' грн.'


            basketbutton.onclick = function () {
                basketElement.remove()
                basketbutton.remove()
                sumBasket = sumBasket - comics.price
                SumEl.textContent = 'Общая сумма: ' + sumBasket + ' грн.'
            }
        }
    }

    basket.onclick = function () {
        const basketBlock = document.querySelector('.basket__block')
        const basketImg = document.querySelector('.basketImg')
        if (basketBlock.style.display === 'none') {
            basketBlock.style.display = 'block'
            basketImg.src = 'openbasket.png'

        } else {
            basketBlock.style.display = 'none'
            basketImg.src = 'basket.png'
        }
    }
}
