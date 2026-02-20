import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { crearVencimiento, getVencimientos, getMatafuegos } from "../../services/api";
import { useUserRole } from "../../security/useUserRole";
import { canUserPerform } from "../../security/permissions";

// Importamos la función de eliminar del archivo api.ts
// Si no existe, la agregamos más abajo
const eliminarVencimiento = async (id: number) => {
  const token = await SecureStore.getItemAsync("token");
  const res = await fetch(`http://10.0.2.2:5000/api/vencimientos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al eliminar");
  return await res.json();
};

export default function VencimientosScreen() {
  const router = useRouter();
  const [vencimientos, setVencimientos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nuevo, setNuevo] = useState({ nombre: "", fecha: "" });
  const rol = useUserRole();

  const calcularDiasRestantes = (fecha: string) => {
    try {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      const venc = new Date(fecha);
      venc.setHours(0, 0, 0, 0);
      
      const diff = venc.getTime() - hoy.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    } catch (error) {
      console.error("Error al calcular días:", error);
      return 0;
    }
  };

  const cargarVencimientos = useCallback(async () => {
    try {
      setLoading(true);

      // Verificar token antes de hacer requests
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const [vencimientosBase, matafuegos] = await Promise.all([
        getVencimientos(),
        getMatafuegos(),
      ]);

      // ✅ Asegurar que sean arrays
      const vencimientosArr = Array.isArray(vencimientosBase) ? vencimientosBase : [];
      const matafuegosArr = Array.isArray(matafuegos) ? matafuegos : [];

      // Recalcular días para vencimientos base
      const vencimientosConDias = vencimientosArr.map((v: any) => ({
        ...v,
        diasRestantes: calcularDiasRestantes(v.fecha),
        esMatafuego: false, // Marcar que NO es matafuego
      }));

      // 🔧 Transformar los matafuegos a formato común
      const vencimientosMatafuegos = matafuegosArr
        .filter((m: any) => m?.fechaVencimiento)
        .map((m: any) => ({
          id: `M${m.id}`,
          nombre: `Matafuego - Piso ${m.piso}`,
          fecha: m.fechaVencimiento,
          diasRestantes: calcularDiasRestantes(m.fechaVencimiento),
          esMatafuego: true, // Marcar que ES matafuego
        }));

      // 🔹 Fusionar todo en un único array y ordenar
      const todos = [...vencimientosConDias, ...vencimientosMatafuegos].sort(
        (a, b) => a.diasRestantes - b.diasRestantes
      );

      setVencimientos(todos);
    } catch (err: any) {
      console.error("❌ Error al cargar vencimientos:", err);
      
      // Si es error de autenticación, redirigir a login
      const msg = String(err?.message || err);
      if (msg.includes("Token inválido") || 
          msg.includes("No autenticado") || 
          msg.includes("Sesión vencida")) {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("user");
        Alert.alert(
          "Sesión expirada",
          "Tu sesión ha expirado. Por favor, iniciá sesión nuevamente.",
          [{ text: "OK", onPress: () => router.replace("/login") }]
        );
        return;
      }
      
      Alert.alert("Error", "No se pudieron cargar los vencimientos.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Recargar cuando la pantalla gana foco
  useFocusEffect(
    useCallback(() => {
      cargarVencimientos();
    }, [cargarVencimientos])
  );

  const handleAgregar = async () => {
    if (!nuevo.nombre || !nuevo.fecha)
      return Alert.alert("⚠️", "Completá todos los campos");

    try {
      const diasRestantes = calcularDiasRestantes(nuevo.fecha);
      await crearVencimiento({ ...nuevo, diasRestantes });
      setNuevo({ nombre: "", fecha: "" });
      Alert.alert("✅", "Vencimiento agregado correctamente");
      cargarVencimientos();
    } catch (error: any) {
      const msg = String(error?.message || error);
      if (msg.includes("Token inválido") || msg.includes("No autenticado")) {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("user");
        router.replace("/login");
        return;
      }
      Alert.alert("Error", "No se pudo agregar el vencimiento");
    }
  };

  const handleEliminar = async (id: any, esMatafuego: boolean) => {
    if (esMatafuego) {
      Alert.alert(
        "No se puede eliminar",
        "Los matafuegos deben eliminarse desde la sección de Matafuegos."
      );
      return;
    }

    Alert.alert(
      "Eliminar vencimiento",
      "¿Estás seguro de que querés eliminar este vencimiento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await eliminarVencimiento(id);
              Alert.alert("✅", "Vencimiento eliminado correctamente");
              cargarVencimientos();
            } catch (error: any) {
              const msg = String(error?.message || error);
              if (msg.includes("Token inválido") || msg.includes("No autenticado")) {
                await SecureStore.deleteItemAsync("token");
                await SecureStore.deleteItemAsync("user");
                router.replace("/login");
                return;
              }
              Alert.alert("Error", "No se pudo eliminar el vencimiento");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text>Cargando vencimientos...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Vencimientos",
          headerStyle: { backgroundColor: "#1E88E5" },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
        }}
      />
      
      <ScrollView style={styles.container}>
        <Text style={styles.title}>📅 Próximos Vencimientos</Text>

        {vencimientos.length === 0 ? (
          <Text style={styles.noData}>No hay vencimientos cargados.</Text>
        ) : (
          vencimientos.map((v) => (
            <View key={v.id} style={styles.card}>
              <View style={styles.row}>
                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color={
                    v.diasRestantes <= 7
                      ? "#E53935"
                      : v.diasRestantes <= 30
                      ? "#FB8C00"
                      : "#43A047"
                  }
                />
                <Text style={styles.cardTitle}>{v.nombre}</Text>
              </View>

              <Text style={styles.cardText}>Vence: {v.fecha}</Text>
              <Text
                style={[
                  styles.dias,
                  v.diasRestantes <= 7
                    ? styles.urgente
                    : v.diasRestantes <= 30
                    ? styles.proximo
                    : styles.ok,
                ]}
              >
                {v.diasRestantes} días restantes
              </Text>

              {/* Botón eliminar solo si NO es matafuego */}
              {!v.esMatafuego && canUserPerform(rol, "eliminar") && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleEliminar(v.id, v.esMatafuego)}
                >
                  <Ionicons name="trash-outline" size={18} color="#E53935" />
                  <Text style={styles.deleteText}>Eliminar</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}

        {/* ➕ Formulario para agregar vencimiento */}
        {canUserPerform(rol, "crear") && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Agregar nuevo vencimiento</Text>
            <TextInput
              placeholder="Nombre (ej: Extintor Piso 1)"
              style={styles.input}
            value={nuevo.nombre}
            onChangeText={(t) => setNuevo({ ...nuevo, nombre: t })}
          />
          <TextInput
            placeholder="Fecha (AAAA-MM-DD)"
            style={styles.input}
            value={nuevo.fecha}
            onChangeText={(t) => setNuevo({ ...nuevo, fecha: t })}
          />
          <Button title="Agregar" onPress={handleAgregar} />
        </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8", padding: 20 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E88E5",
    marginBottom: 15,
    textAlign: "center",
  },
  noData: { textAlign: "center", color: "#777", marginVertical: 10 },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 10,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  cardTitle: { fontWeight: "bold", fontSize: 15, marginLeft: 8, color: "#333" },
  cardText: { fontSize: 13, color: "#555" },
  dias: { fontWeight: "bold", fontSize: 13, marginTop: 4 },
  urgente: { color: "#E53935" },
  proximo: { color: "#FB8C00" },
  ok: { color: "#43A047" },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#FFEBEE",
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  deleteText: {
    color: "#E53935",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 4,
  },
  form: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E88E5",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F6F8",
  },
});