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
  getBotiquines,
  crearBotiquin,
  editarBotiquin,
  eliminarBotiquin,
} from "../services/api";

type Botiquin = {
  id: number;
  piso: string;
  responsable: string;
  elementos: string;
  fechaRevision: string;
};

export default function BotiquinesScreen() {
  const [data, setData] = useState<Botiquin[]>([]);
  const [nuevo, setNuevo] = useState({
    piso: "",
    responsable: "",
    elementos: "",
    fechaRevision: "",
  });
  const [editando, setEditando] = useState<Botiquin | null>(null);
  const [formEdit, setFormEdit] = useState({
    piso: "",
    responsable: "",
    elementos: "",
    fechaRevision: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const res = await getBotiquines();
      setData(Array.isArray(res) ? res : []);
    } catch (e) {
      console.log("❌ Error al cargar botiquines:", e);
    }
  };

  const handleAgregar = async () => {
    if (!nuevo.piso || !nuevo.responsable || !nuevo.elementos || !nuevo.fechaRevision)
      return Alert.alert("⚠️", "Completa todos los campos");

    await crearBotiquin({
      piso: nuevo.piso,
      responsable: nuevo.responsable,
      elementos: nuevo.elementos,
      fechaRevision: nuevo.fechaRevision,
    });

    setNuevo({ piso: "", responsable: "", elementos: "", fechaRevision: "" });
    cargarDatos();
  };

  const handleEliminar = async (id: number) => {
    await eliminarBotiquin(id);
    cargarDatos();
  };

  const empezarEdicion = (item: Botiquin) => {
    setEditando(item);
    setFormEdit({
      piso: item.piso,
      responsable: item.responsable,
      elementos: item.elementos,
      fechaRevision: item.fechaRevision,
    });
  };

  const guardarEdicion = async () => {
    if (!editando) return;
    await editarBotiquin(editando.id, formEdit);
    setEditando(null);
    cargarDatos();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Botiquines",
          headerStyle: { backgroundColor: "#43A047" },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
        }}
      />

      <ScrollView style={styles.container}>
        <Text style={styles.titulo}>Listado de Botiquines</Text>

        {data.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="medical-outline" size={24} color="#43A047" />
              <Text style={styles.cardTitle}>Piso {item.piso}</Text>
            </View>
            <Text style={styles.cardText}>Responsable: {item.responsable}</Text>
            <Text style={styles.cardText}>Elementos: {item.elementos}</Text>
            <Text style={styles.cardFecha}>Revisión: {item.fechaRevision}</Text>

            <View style={styles.cardButtons}>
              <Button title="✏️ Editar" color="#FB8C00" onPress={() => empezarEdicion(item)} />
              <Button title="🗑️ Eliminar" color="#E53935" onPress={() => handleEliminar(item.id)} />
            </View>
          </View>
        ))}

        {/* Formulario de alta */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Agregar nuevo botiquín</Text>

          <TextInput
            placeholder="Piso"
            style={styles.input}
            value={nuevo.piso}
            onChangeText={(t) => setNuevo({ ...nuevo, piso: t })}
          />
          <TextInput
            placeholder="Responsable"
            style={styles.input}
            value={nuevo.responsable}
            onChangeText={(t) => setNuevo({ ...nuevo, responsable: t })}
          />
          <TextInput
            placeholder="Elementos (gasas, alcohol, vendas...)"
            style={styles.input}
            value={nuevo.elementos}
            onChangeText={(t) => setNuevo({ ...nuevo, elementos: t })}
          />
          <TextInput
            placeholder="Fecha revisión (AAAA-MM-DD)"
            style={styles.input}
            value={nuevo.fechaRevision}
            onChangeText={(t) => setNuevo({ ...nuevo, fechaRevision: t })}
          />
          <Button title="➕ Agregar" onPress={handleAgregar} />
        </View>
      </ScrollView>

      {/* Modal de edición */}
      <Modal animationType="fade" transparent visible={!!editando}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Editar Botiquín</Text>

            <TextInput
              placeholder="Piso"
              style={styles.input}
              value={formEdit.piso}
              onChangeText={(t) => setFormEdit({ ...formEdit, piso: t })}
            />
            <TextInput
              placeholder="Responsable"
              style={styles.input}
              value={formEdit.responsable}
              onChangeText={(t) => setFormEdit({ ...formEdit, responsable: t })}
            />
            <TextInput
              placeholder="Elementos"
              style={styles.input}
              value={formEdit.elementos}
              onChangeText={(t) => setFormEdit({ ...formEdit, elementos: t })}
            />
            <TextInput
              placeholder="Fecha revisión"
              style={styles.input}
              value={formEdit.fechaRevision}
              onChangeText={(t) => setFormEdit({ ...formEdit, fechaRevision: t })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#43A047" }]}
                onPress={guardarEdicion}
              >
                <Text style={styles.btnText}>💾 Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#E53935" }]}
                onPress={() => setEditando(null)}
              >
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
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#43A047",
    marginBottom: 20,
  },
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 15, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginLeft: 8 },
  cardText: { fontSize: 14, color: "#555", marginTop: 4 },
  cardFecha: { fontSize: 13, color: "#777" },
  cardButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  form: { marginTop: 20, backgroundColor: "#fff", padding: 15, borderRadius: 10 },
  formTitle: { fontSize: 16, fontWeight: "bold", color: "#43A047", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 8, marginBottom: 10 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: { width: "85%", backgroundColor: "#fff", borderRadius: 10, padding: 20, elevation: 5 },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#43A047",
    marginBottom: 10,
    textAlign: "center",
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  btn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  btnText: { color: "#fff", fontWeight: "bold" },
});
