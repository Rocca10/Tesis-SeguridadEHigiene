import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
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
import {
  getMatafuegos,
  crearMatafuego,
  editarMatafuego,
  eliminarMatafuego,
} from "../services/api";

type Matafuego = {
  id: number;
  piso: string;
  tipo: string;
  kilos: number;
  fechaVencimiento: string;
};

export default function MatafuegosScreen() {
  const [data, setData] = useState<Matafuego[]>([]);
  const [nuevo, setNuevo] = useState({ piso: "", tipo: "", kilos: "", fechaVencimiento: "" });
  const [editando, setEditando] = useState<Matafuego | null>(null);
  const [formEdit, setFormEdit] = useState({ piso: "", tipo: "", kilos: "", fechaVencimiento: "" });
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const res = await getMatafuegos();
      setData(Array.isArray(res) ? res : []);
    } catch (e) {
      console.log("❌ Error al cargar matafuegos:", e);
    }
  };

  const handleAgregar = async () => {
    if (!nuevo.piso || !nuevo.tipo || !nuevo.kilos || !nuevo.fechaVencimiento)
      return Alert.alert("⚠️", "Completa todos los campos");

    await crearMatafuego({
      piso: nuevo.piso,
      tipo: nuevo.tipo,
      kilos: Number(nuevo.kilos),
      fechaVencimiento: nuevo.fechaVencimiento,
    });

    setNuevo({ piso: "", tipo: "", kilos: "", fechaVencimiento: "" });
    cargarDatos();
  };

  const handleEliminar = async (id: number) => {
    await eliminarMatafuego(id);
    cargarDatos();
  };

  const empezarEdicion = (item: Matafuego) => {
    setEditando(item);
    setFormEdit({
      piso: item.piso,
      tipo: item.tipo,
      kilos: String(item.kilos),
      fechaVencimiento: item.fechaVencimiento,
    });
  };

  const guardarEdicion = async () => {
    if (!editando) return;
    await editarMatafuego(editando.id, {
      ...formEdit,
      kilos: Number(formEdit.kilos),
    });
    setEditando(null);
    cargarDatos();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Matafuegos",
          headerStyle: { backgroundColor: "#1E88E5" },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
        }}
      />

      <ScrollView style={styles.container}>
        <Text style={styles.titulo}>Listado de Matafuegos</Text>

        {data.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="flame-outline" size={24} color="#E53935" />
              <Text style={styles.cardTitle}>{item.piso}</Text>
            </View>
            <Text style={styles.cardText}>Tipo: {item.tipo}</Text>
            <Text style={styles.cardText}>Kilos: {item.kilos}</Text>
            <Text style={styles.cardFecha}>Vence: {item.fechaVencimiento}</Text>

            <View style={styles.cardButtons}>
              <Button title="✏️ Editar" color="#FB8C00" onPress={() => empezarEdicion(item)} />
              <Button title="🗑️ Eliminar" color="#E53935" onPress={() => handleEliminar(item.id)} />
            </View>
          </View>
        ))}

        {/* Formulario de alta */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Agregar nuevo matafuego</Text>

          <TextInput placeholder="Piso" style={styles.input} value={nuevo.piso} onChangeText={(t) => setNuevo({ ...nuevo, piso: t })} />
          <TextInput placeholder="Tipo (ABC, AB...)" style={styles.input} value={nuevo.tipo} onChangeText={(t) => setNuevo({ ...nuevo, tipo: t })} />
          <TextInput placeholder="Kilos" keyboardType="numeric" style={styles.input} value={nuevo.kilos} onChangeText={(t) => setNuevo({ ...nuevo, kilos: t })} />
          <TextInput placeholder="Fecha de vencimiento (AAAA-MM-DD)" style={styles.input} value={nuevo.fechaVencimiento} onChangeText={(t) => setNuevo({ ...nuevo, fechaVencimiento: t })} />
          <Button title="➕ Agregar" onPress={handleAgregar} />
        </View>
      </ScrollView>

      {/* 🟦 MODAL DE EDICIÓN */}
      <Modal animationType="fade" transparent visible={!!editando}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Editar Matafuego</Text>

            <TextInput placeholder="Piso" style={styles.input} value={formEdit.piso} onChangeText={(t) => setFormEdit({ ...formEdit, piso: t })} />
            <TextInput placeholder="Tipo" style={styles.input} value={formEdit.tipo} onChangeText={(t) => setFormEdit({ ...formEdit, tipo: t })} />
            <TextInput placeholder="Kilos" keyboardType="numeric" style={styles.input} value={formEdit.kilos} onChangeText={(t) => setFormEdit({ ...formEdit, kilos: t })} />
            <TextInput placeholder="Fecha de vencimiento" style={styles.input} value={formEdit.fechaVencimiento} onChangeText={(t) => setFormEdit({ ...formEdit, fechaVencimiento: t })} />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: "#1E88E5" }]} onPress={guardarEdicion}>
                <Text style={styles.btnText}>💾 Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: "#E53935" }]} onPress={() => setEditando(null)}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F4F6F8" },
  titulo: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#1E88E5", marginBottom: 20 },
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 15, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginLeft: 8 },
  cardText: { fontSize: 14, color: "#555", marginTop: 4 },
  cardFecha: { fontSize: 13, color: "#777" },
  cardButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  form: { marginTop: 20, backgroundColor: "#fff", padding: 15, borderRadius: 10 },
  formTitle: { fontSize: 16, fontWeight: "bold", color: "#1E88E5", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 8, marginBottom: 10 },
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: "85%", backgroundColor: "#fff", borderRadius: 10, padding: 20, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#1E88E5", marginBottom: 10, textAlign: "center" },
  modalButtons: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  btn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  btnText: { color: "#fff", fontWeight: "bold" },
});
