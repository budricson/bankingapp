let account = null;

const routes = {
  "/login": {
    templateId: "login",
    title: "Login - Bank App",
  },
  "/dashboard": {
    templateId: "dashboard",
    title: "Dashboard - Bank App",
    postRender: () => {
      console.log("Dashboard is shown");
    },
  },
  "/credits": {
    templateId: "credits",
    title: "Credits - Bank App",
  },
};

function updateRoute() {
  const path = window.location.pathname;
  const route = routes[path];

  if (!route) {
    return navigate("/login");
  }

  document.title = route.title;

  const template = document.getElementById(route.templateId);
  const view = template.content.cloneNode(true);
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.appendChild(view);

  if (route.postRender) {
    route.postRender();
  }
}

updateRoute("login");

function navigate(path) {
  window.history.pushState({}, path, path);
  updateRoute();
}

function onLinkClick(event) {
  event.preventDefault();
  navigate(event.target.href);
}

window.onpopstate = () => updateRoute();
updateRoute();

function register() {
  const registerForm = document.getElementById("registerForm");
  const formData = new FormData(registerForm);
  const data = Object.fromEntries(formData);
  const jsonData = JSON.stringify(data);
}

async function createAccount(account) {
  try {
    const response = await fetch("//localhost:5000/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: account,
    });
    return await response.json();
  } catch (error) {
    return { error: error.message || "Unknown error" };
  }
}

async function login() {
  const loginForm = document.getElementById("loginForm");
  const user = loginForm.user.value;
  const data = await getAccount(user);

  if (data.error) {
    return console.log("loginError", data.error);
  }

  account = data;
  navigate("/dashboard");
}

async function getAccount(user) {
  try {
    const response = await fetch(
      "//localhost:5000/api/accounts/" + encodeURIComponent(user)
    );
    return await response.json();
  } catch (error) {
    return { error: error.message || "Unknown error" };
  }
}
