import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { crearVencimiento, getVencimientos } from "../../services/api";

export default function VencimientosScreen() {
  const [vencimientos, setVencimientos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nuevo, setNuevo] = useState({ nombre: "", fecha: "" });

  // 🔹 Cargar datos al iniciar
  useEffect(() => {
    cargarVencimientos();
  }, []);

  const calcularDiasRestantes = (fecha: string) => {
    const hoy = new Date();
    const venc = new Date(fecha);
    const diff = venc.getTime() - hoy.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const cargarVencimientos = async () => {
    try {
      setLoading(true);

      const [vencimientosBase, matafuegos] = await Promise.all([
        getVencimientos(),
        fetch("http://10.0.2.2:5000/api/matafuegos").then((r) => r.json()),
      ]);

      // 🔧 Transformar los matafuegos a formato común
      const vencimientosMatafuegos = matafuegos.map((m: any) => ({
        id: `M${m.id}`,
        nombre: `Matafuego - Piso ${m.piso}`,
        fecha: m.fechaVencimiento,
        diasRestantes: calcularDiasRestantes(m.fechaVencimiento),
      }));

      // 🔹 Fusionar todo en un único array y ordenar
      const todos = [...vencimientosBase, ...vencimientosMatafuegos].sort(
        (a, b) => a.diasRestantes - b.diasRestantes
      );

      setVencimientos(todos);
    } catch (err) {
      console.error("❌ Error al cargar vencimientos:", err);
      Alert.alert("Error", "No se pudieron cargar los vencimientos.");
    } finally {
      setLoading(false);
    }
  };

  const handleAgregar = async () => {
    if (!nuevo.nombre || !nuevo.fecha)
      return Alert.alert("⚠️", "Completá todos los campos");

    const diasRestantes = calcularDiasRestantes(nuevo.fecha);
    await crearVencimiento({ ...nuevo, diasRestantes });
    setNuevo({ nombre: "", fecha: "" });
    cargarVencimientos();
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
          </View>
        ))
      )}

      {/* ➕ Formulario para agregar vencimiento */}
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
    </ScrollView>
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
