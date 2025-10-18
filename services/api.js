const API_URL = "http://10.0.2.2:5000";

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
  });W
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
