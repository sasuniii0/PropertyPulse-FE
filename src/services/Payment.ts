import api from "./Api";

// user.ts or types.ts
export type PaymentStatus = "PENDING" | "PAID" | "OVERDUE";

export interface AgentPaymentData {
  success: boolean;
  paymentStatus: PaymentStatus;
}

export interface PaymentDetails {
  _id: string;
  paymentStatus: "PENDING" | "PAID" | "OVERDUE";
  amount: number;
  createdAt: string;
}


export const startAgentPayment = async (token: string) => {
  const res = await api.post(
    import.meta.env.VITE_API_URL + "/api/v1/payment/checkout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// Update payment status to PAID
export const updatePaymentStatus = async (token: string): Promise<AgentPaymentData> => {
  try {
    const res = await api.post(
      import.meta.env.VITE_API_URL + "/api/v1/payment/update",
      {}, // you can include orderId or other data if needed
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Assuming backend returns { success: boolean, paymentStatus: "PAID" | ... }
    return res.data as AgentPaymentData;
  } catch (error) {
    console.error("Failed to update payment status:", error);
    // Return a fallback
    return { success: false, paymentStatus: "PENDING" };
  }
};

export const getPaymentDetails = async (
  token: string
): Promise<PaymentDetails> => {
  if (!token) throw new Error("No access token");

  const res = await api.get("/payment/details", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};
