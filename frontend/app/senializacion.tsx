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
  getSenializacion,
  crearSenializacion,
  editarSenializacion,
  eliminarSenializacion,
} from "../services/api";

type Senializacion = {
  id: number;
  piso: string;
  tipo: string;
  fechaRevision: string;
};

export default function SenializacionScreen() {
  const [data, setData] = useState<Senializacion[]>([]);
  const [nuevo, setNuevo] = useState({
    piso: "",
    tipo: "",
    fechaRevision: "",
  });

  const [editando, setEditando] = useState<Senializacion | null>(null);
  const [formEdit, setFormEdit] = useState({
    piso: "",
    tipo: "",
    fechaRevision: "",
  });

  // Cargar datos al iniciar
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const res = await getSenializacion();
      setData(Array.isArray(res) ? res : []);
    } catch (e) {
      console.log("❌ Error al cargar señalización:", e);
    }
  };

  const handleAgregar = async () => {
    if (!nuevo.piso || !nuevo.tipo || !nuevo.fechaRevision) {
      return Alert.alert("⚠️", "Completa todos los campos");
    }

    await crearSenializacion({
      piso: nuevo.piso,
      tipo: nuevo.tipo,
      fechaRevision: nuevo.fechaRevision,
    });

    setNuevo({ piso: "", tipo: "", fechaRevision: "" });
    cargarDatos();
  };

  const handleEliminar = async (id: number) => {
    Alert.alert("Eliminar", "¿Seguro que querés eliminar este registro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await eliminarSenializacion(id);
          cargarDatos();
        },
      },
    ]);
  };

  const empezarEdicion = (item: Senializacion) => {
    setEditando(item);
    setFormEdit({
      piso: item.piso,
      tipo: item.tipo,
      fechaRevision: item.fechaRevision,
    });
  };

  const guardarEdicion = async () => {
    if (!editando) return;

    if (!formEdit.piso || !formEdit.tipo || !formEdit.fechaRevision) {
      return Alert.alert("⚠️", "Completa todos los campos");
    }

    await editarSenializacion(editando.id, formEdit);
    setEditando(null);
    cargarDatos();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Señalización",
          headerStyle: { backgroundColor: "#FB8C00" },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
        }}
      />

      <ScrollView style={styles.container}>
        <Text style={styles.titulo}>Listado de Señalización</Text>

        {data.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="exit-outline" size={24} color="#FB8C00" />
              <Text style={styles.cardTitle}>Piso {item.piso}</Text>
            </View>
            <Text style={styles.cardText}>Tipo: {item.tipo}</Text>
            <Text style={styles.cardFecha}>
              Última revisión: {item.fechaRevision}
            </Text>

            <View style={styles.cardButtons}>
              <Button
                title="✏️ Editar"
                color="#1E88E5"
                onPress={() => empezarEdicion(item)}
              />
              <Button
                title="🗑️ Eliminar"
                color="#E53935"
                onPress={() => handleEliminar(item.id)}
              />
            </View>
          </View>
        ))}

        {/* Formulario de alta */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Agregar nueva señalización</Text>

          <TextInput
            placeholder="Piso"
            style={styles.input}
            value={nuevo.piso}
            onChangeText={(t) => setNuevo({ ...nuevo, piso: t })}
          />
          <TextInput
            placeholder="Tipo (Salida, Extintor, Emergencia...)"
            style={styles.input}
            value={nuevo.tipo}
            onChangeText={(t) => setNuevo({ ...nuevo, tipo: t })}
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
            <Text style={styles.modalTitle}>Editar Señalización</Text>

            <TextInput
              placeholder="Piso"
              style={styles.input}
              value={formEdit.piso}
              onChangeText={(t) => setFormEdit({ ...formEdit, piso: t })}
            />
            <TextInput
              placeholder="Tipo"
              style={styles.input}
              value={formEdit.tipo}
              onChangeText={(t) => setFormEdit({ ...formEdit, tipo: t })}
            />
            <TextInput
              placeholder="Fecha revisión"
              style={styles.input}
              value={formEdit.fechaRevision}
              onChangeText={(t) =>
                setFormEdit({ ...formEdit, fechaRevision: t })
              }
            />

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
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F4F6F8" },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FB8C00",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginLeft: 8 },
  cardText: { fontSize: 14, color: "#555", marginTop: 4 },
  cardFecha: { fontSize: 13, color: "#777" },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  form: { marginTop: 20, backgroundColor: "#fff", padding: 15, borderRadius: 10 },
  formTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FB8C00",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },

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
    color: "#FB8C00",
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
