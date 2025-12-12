const API_URL = "http://10.0.2.2:5000";

//VENCIMIENTOS
export async function getVencimientos() {
  const res = await fetch(`${API_URL}/api/vencimientos`);
  return await res.json();
}

export async function getAlertas() {
  const res = await fetch(`${API_URL}/api/alertas`);
  return await res.json();
}

export async function crearVencimiento(data) {
  const res = await fetch(`${API_URL}/api/vencimientos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function crearAlerta(data) {
  const res = await fetch(`${API_URL}/api/alertas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function getMatafuegos() {
  const res = await fetch(`${API_URL}/api/matafuegos`);
  return await res.json();
}

export async function crearMatafuego(data) {
  const res = await fetch(`${API_URL}/api/matafuegos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function editarMatafuego(id, data) {
  const res = await fetch(`${API_URL}/api/matafuegos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function eliminarMatafuego(id) {
  const res = await fetch(`${API_URL}/api/matafuegos/${id}`, { method: "DELETE" });
  return await res.json();
}

// BOTIQUINES
export async function getBotiquines() {
  const res = await fetch(`${API_URL}/api/botiquines`);
  return await res.json();
}

export async function crearBotiquin(data) {
  const res = await fetch(`${API_URL}/api/botiquines`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function editarBotiquin(id, data) {
  const res = await fetch(`${API_URL}/api/botiquines/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function eliminarBotiquin(id) {
  const res = await fetch(`${API_URL}/api/botiquines/${id}`, {
    method: "DELETE",
  });
  return await res.json();
}

// SEÑALIZACIÓN
export async function getSenializacion() {
  const res = await fetch(`${API_URL}/api/senializacion`);
  return await res.json();
}

export async function crearSenializacion(data) {
  const res = await fetch(`${API_URL}/api/senializacion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function editarSenializacion(id, data) {
  const res = await fetch(`${API_URL}/api/senializacion/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function eliminarSenializacion(id) {
  const res = await fetch(`${API_URL}/api/senializacion/${id}`, {
    method: "DELETE",
  });
  return await res.json();
}
