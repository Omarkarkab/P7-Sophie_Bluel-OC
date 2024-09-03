//Selection élements DOM et soumission du formulaire
async function addListenerLogin() {
    const loginForm = document.querySelector(".login");
    const errorMessage = document.getElementById("error-message")
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Récupération données formulaire
        const login = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        };
        //Envoi requête HTTP
        const chargeUtile = JSON.stringify(login);
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        });
        console.log(response)

        //Traitement API
        if (response.ok) {
            const data = await response.json();
            console.log(data)
            localStorage.setItem('authToken', data.token);
            window.location.href = "index.html";
        } else {
            const errorData = await response.json();
            console.error("Login failed:", errorData);
            errorMessage.textContent = "Échec de la connexion : " + (errorData.message || "Veuillez vérifier vos identifiants.");
        }
    });
}
addListenerLogin()