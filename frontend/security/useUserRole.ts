import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import type { Rol } from "./permissions";

export function useUserRole() {
  const [rol, setRol] = useState<Rol>("OPERADOR");

  useEffect(() => {
    (async () => {
      const userStr = await SecureStore.getItemAsync("user");
      if (!userStr) return;
      try {
        const user = JSON.parse(userStr);
        if (user?.rol) setRol(user.rol as Rol);
      } catch {}
    })();
  }, []);

  return rol;
}