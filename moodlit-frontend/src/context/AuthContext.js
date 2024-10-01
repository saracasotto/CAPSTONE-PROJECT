import { createContext, useState, useEffect } from "react";

// creo contesto per condividere stato e altre info tra i vari componenti senza dover passare props
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("auto"); //Imposto tema default

  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;

  const [loading, setLoading] = useState(true);

  // Funzione per login
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_HOST}:${API_PORT}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        setTheme(data.user.themePreference); // prendo da backend
        localStorage.setItem("theme", data.user.themePreference); // salvo in storage
      } else {
        console.error("Errore di autenticazione:", data.message);
      }
    } catch (error) {
      console.error("Errore durante il login:", error);
    }
  };

  // Funzione per logout
  const logout = () => {
    localStorage.removeItem("token"); // Rimuovo solo il token ma mantengo preferenze in locale
    setUser(null);
  };

  // Verifica il token all'avvio dell'app
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const res = await fetch(`${API_HOST}:${API_PORT}/api/users/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();

          if (res.ok) {
            setUser(data);
            setTheme(data.themePreference);
            localStorage.setItem("theme", data.themePreference);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Errore durante la verifica del token:", error);
          logout();
        }
      } else {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
          setTheme(savedTheme);
        }
        setUser(null);
      }

      setLoading(false);
    };

    verifyToken(); // Chiama verifyToken quando il componente viene montato
  }, [API_HOST, API_PORT]);

  // Gestione del cambiamento di tema
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Mostra un caricamento durante la verifica dell'autenticazione
  if (loading) {
    return <div>Loading...</div>;
  }

  // Restituisco il provider di contesto con tutti i valori e le funzioni necessarie ai figli
  return (
    <AuthContext.Provider value={{ user, login, logout, theme, handleThemeChange }}>
      {children}
    </AuthContext.Provider>
  );
};