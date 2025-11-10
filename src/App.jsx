import { useState, useEffect } from "react";

function App() {
  const [numeroNomina, setNumeroNomina] = useState("");
  const [nombre, setNombre] = useState("");
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [menuSemana, setMenuSemana] = useState([]);
  const [adminMode, setAdminMode] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [empleados, setEmpleados] = useState([]);

  // Cargar empleados desde JSON
  useEffect(() => {
    fetch("/empleados.json")
      .then((res) => res.json())
      .then((data) => setEmpleados(data))
      .catch((err) => console.error("Error cargando empleados:", err));
  }, []);

  // Autocompletado del nombre según número de nómina
  useEffect(() => {
    const empleado = empleados.find(
      (emp) => emp["Número de Nómina"] === Number(numeroNomina)
    );
    setNombre(empleado ? empleado["Nombre"] : "");
  }, [numeroNomina, empleados]);

  // Inicializar menú de la semana
  useEffect(() => {
    setMenuSemana([
      { dia: "Lunes", platillo: "Flautas de Papa" },
      { dia: "Martes", platillo: "Indios" },
      { dia: "Miércoles", platillo: "Mole de P/co" },
      { dia: "Jueves", platillo: "Club Sandwich" },
      { dia: "Viernes", platillo: "Pambazos" },
    ]);
  }, []);

  // Selección de días
  const toggleDia = (dia) => {
    if (diasSeleccionados.includes(dia)) {
      setDiasSeleccionados(diasSeleccionados.filter((d) => d !== dia));
    } else {
      setDiasSeleccionados([...diasSeleccionados, dia]);
    }
  };

  // Registrar
  const registrar = async () => {
    if (!nombre) {
      alert("Por favor ingresa un número de nómina válido.");
      return;
    }

    const registro = { numeroNomina, nombre, diasSeleccionados };

    try {
      const res = await fetch(
        "https://registro-comedor-backend.onrender.com/api/registrar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registro),
        }
      );

      if (res.ok) {
        alert("✅ Registro completado con éxito.");
        setDiasSeleccionados([]);
      } else {
        alert("❌ Error al guardar el registro.");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("⚠️ Error al conectar con el servidor.");
    }
  };

  // Login Admin
  const loginAdmin = () => {
    if ((usuario === "Lsustaita" || usuario === "Losorio") && password === "RH2026") {
      setAdminMode(true);
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  // Descargar Excel
  const descargarExcel = async () => {
    try {
      const res = await fetch(
        "https://registro-comedor-backend.onrender.com/api/descargar-excel"
      );
      if (!res.ok) throw new Error("Error al descargar el archivo.");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "registros_comedor.xlsx";
      a.click();
    } catch (error) {
      console.error(error);
      alert("⚠️ Error al conectar con el servidor.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#001F3F",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      {!adminMode && (
        <button
          onClick={() =>
            (document.getElementById("loginForm").style.display = "block")
          }
          style={{
            position: "absolute",
            right: "20px",
            top: "20px",
            backgroundColor: "#fff",
            color: "#001F3F",
            border: "none",
            borderRadius: "8px",
            padding: "8px 15px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Iniciar sesión (Admin)
        </button>
      )}

      <div
        id="loginForm"
        style={{
          display: "none",
          position: "absolute",
          right: "20px",
          top: "60px",
          backgroundColor: "white",
          color: "#001F3F",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          width: "250px",
        }}
      >
        <h4>Inicio de Sesión</h4>
        <input
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
        />
        <button
          onClick={loginAdmin}
          style={{
            backgroundColor: "#001F3F",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Entrar
        </button>
      </div>

      <h1 style={{ textAlign: "center", color: "#fff" }}>
        Registro de Comedor Peasa
      </h1>

      {adminMode ? (
        <div
          style={{
            backgroundColor: "white",
            color: "#001F3F",
            padding: "20px",
            borderRadius: "15px",
            maxWidth: "600px",
            margin: "40px auto",
            textAlign: "center",
          }}
        >
          <h2>Panel de Administración</h2>
          <p>Puedes descargar todos los registros realizados.</p>
          <button
            onClick={descargarExcel}
            style={{
              backgroundColor: "#001F3F",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "10px",
              marginTop: "20px",
              cursor: "pointer",
            }}
          >
            📥 Descargar Registros
          </button>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "white",
            color: "#001F3F",
            padding: "20px",
            borderRadius: "15px",
            maxWidth: "600px",
            margin: "40px auto",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          <label>Número de Nómina:</label>
          <input
            type="number"
            value={numeroNomina}
            onChange={(e) => setNumeroNomina(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "15px",
              border: "1px solid #ccc",
            }}
          />

          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            readOnly
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              backgroundColor: "#f4f4f4",
            }}
          />

          <h3>Menú de la Semana</h3>
          <ul>
            {menuSemana.map((item, index) => (
              <li key={index}>
                <strong>{item.dia}:</strong> {item.platillo}
              </li>
            ))}
          </ul>

          <h3>Selecciona los días que deseas comedor:</h3>
          <div>
            {menuSemana.map((item) => (
              <label key={item.dia} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  checked={diasSeleccionados.includes(item.dia)}
                  onChange={() => toggleDia(item.dia)}
                />{" "}
                {item.dia}
              </label>
            ))}
          </div>

          <button
            onClick={registrar}
            style={{
              backgroundColor: "#001F3F",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "10px",
              marginTop: "20px",
              cursor: "pointer",
            }}
          >
            Registrar
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
