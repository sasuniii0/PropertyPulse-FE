import { createContext, useContext, useState } from "react";

const AuthModalContext = createContext<any>(null);

export function AuthModalProvider({ children }: any) {
  const [modal, setModal] = useState<"signin" | "signup" | null>(null);

  const openSignIn = () => setModal("signin");
  const openSignUp = () => setModal("signup");
  const closeModal = () => setModal(null);

  return (
    <AuthModalContext.Provider value={{ modal, openSignIn, openSignUp, closeModal }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  return useContext(AuthModalContext);
}
