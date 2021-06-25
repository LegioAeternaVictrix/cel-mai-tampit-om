/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

export const signup = async (
  username,
  firstName,
  lastName,
  email,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/signup",
      data: {
        username,
        firstName,
        lastName,
        email,
        password,
        passwordConfirm
      }
    });

    if (res.data.status === "success") {
      showAlert(
        "success",
        "We have sent an email with a confirmation link to your email address. In order to complete the sign-up process, please click the confirmation link."
      );
      window.setTimeout(() => {
        location.assign("/");
      }, 500);
    }
  } catch (err) {
    showAlert("danger", "Error signing up! Please try again.");
  }
};
