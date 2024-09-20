import { createContext, useState, useEffect } from "react";

// creo contesto per condividere stato e altre info tra i vari componenti senza dover passare props
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("auto"); //Imposto tema default

  // Mostra caricamento mentre l'app controlla se l'utente è autenticato o meno
  // Evito che l'utente veda componenti non corretti mentre il contesto non ha ancora terminato il controllo dell'auth
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
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
        setTheme(data.user.themePreference); //prendo da backend
        localStorage.setItem("theme", data.user.themePreference); // salvo in storage
      } else {
        console.error("Errore di autenticazione:", data.message);
      }
    } catch (error) {
      console.error("Errore durante il login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token"); //rimuovo solo il token ma mantengo preferenze in locale
    setUser(null);
  };


  /*
    Controllo se esiste un token salvato nel localStorage.
    Se c'è, invio richiesta al backend per verificare se il token è valido.
    -Token valido, imposto utente con setUser e il tema con setTheme. 
    -Token non valido, utente disconnesso con logout.
    -Non c'è Token, recupero solo il tema dal localStorage anche se non auth.
 */
  const verifyToken = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await fetch("/api/users/me", {
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

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };


  //eseguo la funzione verifyToken una sola volta, quando il componente viene montato
  //Verifico stato di autenticazione utente e recupero il tema dal backend o dal localStorage.
  useEffect(() => {
    verifyToken();
  });

  if (loading) {
    return <div>Loading...</div>;
  }


  //Restituisco il provider di contesto con tutti i valori e le funzioni necessarie ai figli
  return (
    <AuthContext.Provider
      value={{ user, login, logout, theme, handleThemeChange }}
    >
      {children}
    </AuthContext.Provider>
  );
};

