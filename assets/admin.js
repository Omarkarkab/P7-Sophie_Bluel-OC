//Token login
const adminElements = document.querySelectorAll(".admin-element");
adminElements.forEach((element) => {
    if (localStorage.getItem("authToken")) {
        element.classList.remove("hidden");
    }
});