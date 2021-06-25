/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";
const stripe = Stripe(
  "pk_test_51IMdGlDJ7RFd9fmdKKgb5HUkqThlBd9hiTmnkHOkUa7ClKvP84fvisVGaKPW14l1XW4UuuYGtN4hDFVUrJGVybIn00jnfBo1pp"
);

export const buyCourse = async courseId => {
  try {
    // Get checkout session from API
    const session = await axios(`/api/v1/orders/checkout-session/${courseId}`);

    // Create checkout form
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert("danger", err);
  }
};
