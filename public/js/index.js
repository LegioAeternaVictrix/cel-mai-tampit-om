/* eslint-disable */
import "@babel/polyfill";
import { signup } from "./signup.js";
import { login, logout } from "./login";
import { updateSettings } from "./updateSettings";
import { buyCourse } from "./stripe.js";

// DOM ELEMENTS
const loginForm = document.querySelector(".form-login");
const signupForm = document.querySelector(".form-signup");
const logOutBtn = document.querySelector(".logout-btn");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const buyBtn = document.getElementsByClassName("buy-course-btn");

if (loginForm)
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });

if (signupForm)
  signupForm.addEventListener("submit", e => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;

    signup(username, firstName, lastName, email, password, passwordConfirm);
  });

if (logOutBtn) logOutBtn.addEventListener("click", logout);

if (userDataForm)
  userDataForm.addEventListener("submit", e => {
    e.preventDefault();
    const form = new FormData();
    form.append("username", document.getElementById("username").value);
    form.append("firstName", document.getElementById("firstName").value);
    form.append("lastName", document.getElementById("lastName").value);
    form.append("email", document.getElementById("email").value);
    form.append("image", document.getElementById("photo").files[0]);

    updateSettings(form, "data");
  });

if (userPasswordForm)
  userPasswordForm.addEventListener("submit", async e => {
    e.preventDefault();
    document.querySelector(".btn-save-password").textContent = "Updating...";

    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );

    document.querySelector(".btn-save-password").textContent = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });

if (buyBtn)
  for (let i = 0; i < buyBtn.length; i++) {
    buyBtn[i].addEventListener("click", e => {
      e.target.textContent = "Processing...";
      const courseId = e.target.dataset.courseId;

      buyCourse(courseId);
    });
  }
