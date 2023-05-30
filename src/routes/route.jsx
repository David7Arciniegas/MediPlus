import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

// Objeto observable para notificar cambios en el estado de autenticación
const authStatusObservable = {
  observers: [],
  subscribe: function (observer) {
    this.observers.push(observer);
  },
  notify: function () {
    this.observers.forEach((observer) => observer());
  },
};

const Authmiddleware = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const authUser = localStorage.getItem("authUser");

    if (authUser) {
      setIsAuthenticated(true);
    }

    setIsVerified(true); // Indicar que la verificación ha finalizado

    // Suscribirse al objeto observable para recibir notificaciones de cambios en el estado de autenticación
    authStatusObservable.subscribe(handleAuthStatusChange);
  }, []);

  const handleAuthStatusChange = () => {
    const authUser = localStorage.getItem("authUser");
    setIsAuthenticated(!!authUser);
  };

  if (!isVerified) {
    return <div>Verifying...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={{ pathname: "/internal-dashboard-login", state: { from: props.location } }} />
    );
  }

  return <React.Fragment>{props.children}</React.Fragment>;
};

export default Authmiddleware;

// Función para notificar cambios en el estado de autenticación
export const notifyAuthStatusChange = () => {
  authStatusObservable.notify();
};
