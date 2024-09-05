//Token login

if (localStorage.getItem('authToken')) {
	const adminElements = document.querySelectorAll('.admin-element')
	const logoutBtn = document.querySelector('.logout')

	adminElements.forEach((element) => {
		if (element.classList.contains('hidden')) {
			element.classList.remove('hidden')
		} else {
			element.classList.add('hidden')
		}
	})

	logoutBtn.addEventListener('click', function (e) {
		localStorage.removeItem('authToken')
		window.location.href = ''
	})

}
