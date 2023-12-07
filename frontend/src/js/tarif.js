const category = document.querySelectorAll('.categoryPrice')
const perYerDiscount = document.querySelector('#perYerDiscount')
const perYer = document.querySelector('#perYer')
const perMonth = document.querySelector('#perMonth')
const perMonthDiscount = document.querySelector('#perMonthDiscount')
const prices = {
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
category.forEach((span) => {
    span.addEventListener('click', (e) => {
        const {id} = e.target
        perMonth.textContent = prices[id].perMonth
        perYer.textContent = prices[id].perYer
        perMonthDiscount.textContent = prices[id].perMonthDiscount
        perYerDiscount.textContent = prices[id].perYerDiscount
         category.forEach((sp)=> sp.classList.remove('active'))
        e.target.classList.add('active')
    })
})
