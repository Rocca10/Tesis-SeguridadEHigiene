export type Rol = "ADMIN" | "TECNICO" | "OPERADOR";
export type Action = "ver" | "crear" | "editar" | "eliminar" | "exportar" | "importar";

export const PERMISOS: Record<Rol, Record<Action, boolean>> = {
  ADMIN:    { ver: true, crear: true, editar: true, eliminar: true, exportar: true,  importar: true },
  TECNICO:  { ver: true, crear: true, editar: false, eliminar: false, exportar: false, importar: false },
  OPERADOR: { ver: true, crear: false, editar: false, eliminar: false, exportar: false, importar: false },
};

export function canUserPerform(rol: Rol, action: Action) {
  return !!PERMISOS?.[rol]?.[action];
}