import axios from "axios";

export const startAgentPayment = async (token: string) => {
  const res = await axios.post(
    "http://localhost:5000/api/v1/payment/checkout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
