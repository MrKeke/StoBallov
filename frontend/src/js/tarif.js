const category = document.querySelectorAll('.categoryPrice') // поиск в документе катеоргий тарифов
const perYerDiscount = document.querySelector('#perYerDiscount') // поиск в документе скдику года
const perYer = document.querySelector('#perYer') // поиск в документе цену за год
const perMonth = document.querySelector('#perMonth') // поиск в документе цену за месяц
const perMonthDiscount = document.querySelector('#perMonthDiscount') // поиск в документе скдики месяца
const prices = { // обозначаем цены и скидки всех тарифов
    selfTeaching: {
        perYerDiscount: '17 500 ₽',
        perYer: '16 000 ₽',
        perMonth: '2 500 ₽',
        perMonthDiscount: '',
    },
    standard:{
        perYerDiscount: '56 000 ₽',
        perYer: '49 980 ₽',
        perMonth: '7 890 ₽',
        perMonthDiscount: '',
    },
    premium:{
        perYerDiscount: '67 200 ₽',
        perYer: '50 980 ₽',
        perMonth: '9 590 ₽',
        perMonthDiscount: '',
    }

}
category.forEach((span) => { // проходимся по всем категориям
    span.addEventListener('click', (e) => { // добавляем к ним действие по клику
        const {id} = e.target // смотрим какой из категорий выбрали
        perMonth.textContent = prices[id].perMonth // ставим цену за месяц
        perYer.textContent = prices[id].perYer // ставим цену за год
        perMonthDiscount.textContent = prices[id].perMonthDiscount // ставим скидку за месяц
        perYerDiscount.textContent = prices[id].perYerDiscount // ставим скидку за год
         category.forEach((sp)=> sp.classList.remove('active')) // переключаем выбранное
        e.target.classList.add('active')
    })
})
