// components/Login.js
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await signIn({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      alert("Inicio de sesión exitoso.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl mb-4">Iniciar Sesión</h2>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 border rounded mb-4"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-2 border rounded mb-4"
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Iniciar Sesión
      </button>
    </form>
  );
};

export default Login;
