import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL = "http://10.0.2.2:5000/api/alertas";

const COLORES = [
  { name: "Rojo", value: "#E53935" },
  { name: "Verde", value: "#43A047" },
  { name: "Amarillo", value: "#FBC02D" },
  { name: "Azul", value: "#1E88E5" },
  { name: "Naranja", value: "#FB8C00" },
];

type Alerta = {
  id: number;
  tipo: string;
  mensaje: string;
  icono?: string;
  color?: string;
};

export default function AlertasScreen() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [nueva, setNueva] = useState({
    tipo: "",
    mensaje: "",
    icono: "alert-circle-outline",
    color: "#E53935",
  });
  const [editando, setEditando] = useState<Alerta | null>(null);
  const [formEdit, setFormEdit] = useState({
    tipo: "",
    mensaje: "",
    icono: "",
    color: "#E53935",
  });

  useEffect(() => {
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setAlertas(data);
    } catch (err) {
      console.log("❌ Error al cargar alertas:", err);
    } finally {
      setLoading(false);
    }
  };

  const crearAlerta = async () => {
    if (!nueva.tipo || !nueva.mensaje)
      return Alert.alert("⚠️", "Completa tipo y mensaje");

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nueva),
    });

    setNueva({
      tipo: "",
      mensaje: "",
      icono: "alert-circle-outline",
      color: "#E53935",
    });
    cargarAlertas();
  };

  const eliminarAlerta = async (id: number) => {
    Alert.alert("🗑️ Eliminar", "¿Deseas eliminar esta alerta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          cargarAlertas();
        },
      },
    ]);
  };

  const empezarEdicion = (a: Alerta) => {
    setEditando(a);
    setFormEdit({
      tipo: a.tipo,
      mensaje: a.mensaje,
      icono: a.icono || "alert-circle-outline",
      color: a.color || "#E53935",
    });
  };

  const guardarEdicion = async () => {
    if (!editando) return;
    await fetch(`${API_URL}/${editando.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formEdit),
    });
    setEditando(null);
    cargarAlertas();
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text>Cargando alertas...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Alertas Activas</Text>

      {alertas.length === 0 ? (
        <Text style={styles.noAlertas}>No hay alertas registradas.</Text>
      ) : (
        alertas.map((a) => (
          <View key={a.id} style={styles.card}>
            <View style={styles.row}>
              <Ionicons
                name={(a.icono as any) || "alert-circle-outline"}
                size={24}
                color={a.color || "#E53935"}
              />
              <Text style={[styles.tipo, { color: a.color || "#E53935" }]}>
                {a.tipo}
              </Text>
            </View>
            <Text style={styles.mensaje}>{a.mensaje}</Text>
            <View style={styles.buttons}>
              <Button
                title="✏️ Editar"
                color="#FB8C00"
                onPress={() => empezarEdicion(a)}
              />
              <Button
                title="🗑️ Eliminar"
                color="#E53935"
                onPress={() => eliminarAlerta(a.id)}
              />
            </View>
          </View>
        ))
      )}

      {/* ➕ Crear nueva alerta */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Agregar nueva alerta</Text>

        <TextInput
          placeholder="Tipo"
          style={styles.input}
          value={nueva.tipo}
          onChangeText={(t) => setNueva({ ...nueva, tipo: t })}
        />
        <TextInput
          placeholder="Mensaje"
          style={styles.input}
          value={nueva.mensaje}
          onChangeText={(t) => setNueva({ ...nueva, mensaje: t })}
        />

        <Text style={styles.label}>Color:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={nueva.color}
            onValueChange={(value) => setNueva({ ...nueva, color: value })}
          >
            {COLORES.map((c) => (
              <Picker.Item
                key={c.value}
                label={c.name}
                value={c.value}
                color={c.value}
              />
            ))}
          </Picker>
        </View>

        <Button title="➕ Crear Alerta" onPress={crearAlerta} />
      </View>

      {/* ✏️ Modal de edición */}
      <Modal animationType="fade" transparent visible={!!editando}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Editar Alerta</Text>

            <TextInput
              placeholder="Tipo"
              style={styles.input}
              value={formEdit.tipo}
              onChangeText={(t) => setFormEdit({ ...formEdit, tipo: t })}
            />
            <TextInput
              placeholder="Mensaje"
              style={styles.input}
              value={formEdit.mensaje}
              onChangeText={(t) => setFormEdit({ ...formEdit, mensaje: t })}
            />

            <Text style={styles.label}>Color:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formEdit.color}
                onValueChange={(value) =>
                  setFormEdit({ ...formEdit, color: value })
                }
              >
                {COLORES.map((c) => (
                  <Picker.Item
                    key={c.value}
                    label={c.name}
                    value={c.value}
                    color={c.value}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#E53935" }]}
                onPress={() => setEditando(null)}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#1E88E5" }]}
                onPress={guardarEdicion}
              >
                <Text style={styles.btnText}>💾 Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  noAlertas: { textAlign: "center", color: "#777", marginTop: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 10,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  tipo: { fontWeight: "bold", fontSize: 16, marginLeft: 8 },
  mensaje: { fontSize: 14, color: "#333" },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  form: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
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
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E88E5",
    marginBottom: 10,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  btn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  btnText: { color: "#fff", fontWeight: "bold" },
});
