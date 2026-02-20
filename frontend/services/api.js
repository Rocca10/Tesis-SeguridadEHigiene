import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const API_URL = "http://10.0.2.2:5000"; // emulador Android

// ✅ Función genérica para fetch con autenticación
async function fetchConAuth(path, options = {}) {
  const token = await SecureStore.getItemAsync("token");

  const headers = {
    ...(options.headers || {}),
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  const data = await res.json().catch(() => null);

  // ✅ Si el token no sirve, limpiamos y mandamos a login
  if (res.status === 401) {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    router.replace("/login");
    throw new Error(data?.message || "No autenticado");
  }

  if (!res.ok) {
    throw new Error(data?.message || `Error ${res.status}`);
  }

  return data;
}

// ======================
// PERMISOS Y USUARIO
// ======================

// ✅ NUEVO: Obtener usuario actual
export async function getCurrentUser() {
  const userStr = await SecureStore.getItemAsync("user");
  if (!userStr) return null;
  return JSON.parse(userStr);
}

// ✅ NUEVO: Verificar si el usuario puede realizar una acción
export async function canUserDo(action) {
  const user = await getCurrentUser();
  if (!user) return false;

  const PERMISOS = {
    ADMIN: {
      crear: true,
      editar: true,
      eliminar: true,
      ver: true,
      exportar: true,
      importar: true,
    },
    TECNICO: {
      crear: true,
      editar: false,
      eliminar: false,
      ver: true,
      exportar: false,
      importar: false,
    },
    OPERADOR: {
      crear: false,
      editar: false,
      eliminar: false,
      ver: true,
      exportar: false,
      importar: false,
    }
  };

  return PERMISOS[user.rol]?.[action] || false;
}

// ======================
// VENCIMIENTOS
// ======================
export function getVencimientos() {
  return fetchConAuth("/api/vencimientos");
}

export function crearVencimiento(data) {
  return fetchConAuth("/api/vencimientos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ======================
// ALERTAS
// ======================
export function getAlertas() {
  return fetchConAuth("/api/alertas");
}

export function crearAlerta(data) {
  return fetchConAuth("/api/alertas", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ======================
// MATAFUEGOS
// ======================
export function getMatafuegos() {
  return fetchConAuth("/api/matafuegos");
}

export function crearMatafuego(data) {
  return fetchConAuth("/api/matafuegos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function editarMatafuego(id, data) {
  return fetchConAuth(`/api/matafuegos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function eliminarMatafuego(id) {
  return fetchConAuth(`/api/matafuegos/${id}`, {
    method: "DELETE",
  });
}

// ======================
// BOTIQUINES
// ======================
export function getBotiquines() {
  return fetchConAuth("/api/botiquines");
}

export function crearBotiquin(data) {
  return fetchConAuth("/api/botiquines", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function editarBotiquin(id, data) {
  return fetchConAuth(`/api/botiquines/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function eliminarBotiquin(id) {
  return fetchConAuth(`/api/botiquines/${id}`, {
    method: "DELETE",
  });
}

// ======================
// SEÑALIZACION
// ======================
export function getSenializacion() {
  return fetchConAuth("/api/senializacion");
}

export function crearSenializacion(data) {
  return fetchConAuth("/api/senializacion", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function editarSenializacion(id, data) {
  return fetchConAuth(`/api/senializacion/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function eliminarSenializacion(id) {
  return fetchConAuth(`/api/senializacion/${id}`, {
    method: "DELETE",
  });
}