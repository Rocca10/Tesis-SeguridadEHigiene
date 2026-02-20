import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";

import { useUserRole } from "../../security/useUserRole";
import { canUserPerform } from "../../security/permissions";

// ⚠️ Si querés, dejalo, pero ahora auto-detecta si el nombre real es otro
const DB_NAME = "seguridad.db";
const SQLITE_DIR = `${FileSystem.documentDirectory}SQLite`;

async function findDbPath(): Promise<string | null> {
  // 1) Intentamos variantes comunes
  const base = DB_NAME.replace(/\.db$/i, "");
  const candidates = [
    `${SQLITE_DIR}/${DB_NAME}`,
    `${SQLITE_DIR}/${base}`,
    `${SQLITE_DIR}/${base}.db`,
    `${SQLITE_DIR}/${base}.sqlite`,
    `${SQLITE_DIR}/${base}.sqlite3`,
  ];

  for (const path of candidates) {
    const info = await FileSystem.getInfoAsync(path);
    if (info.exists) return path;
  }

  // 2) Si no aparece, buscamos cualquier archivo .db/.sqlite en SQLite/
  const dirInfo = await FileSystem.getInfoAsync(SQLITE_DIR);
  if (!dirInfo.exists) return null;

  const files = await FileSystem.readDirectoryAsync(SQLITE_DIR);

  const preferred = files.find((f) =>
    f.toLowerCase().includes(base.toLowerCase())
  );

  const anyDb =
    preferred ??
    files.find((f) => {
      const x = f.toLowerCase();
      return x.endsWith(".db") || x.endsWith(".sqlite") || x.endsWith(".sqlite3");
    });

  return anyDb ? `${SQLITE_DIR}/${anyDb}` : null;
}

export default function ConfiguracionScreen() {
  const router = useRouter();
  const rol = useUserRole();

  const [usuario, setUsuario] = useState<any>(null);
  const [alertasActivas, setAlertasActivas] = useState(true);
  const [diasAviso, setDiasAviso] = useState(15);
  const [dbActual, setDbActual] = useState<string>("SQLite/(sin detectar)");

  useEffect(() => {
    const cargarUsuarioYDb = async () => {
      const user = await SecureStore.getItemAsync("user");
      if (user) setUsuario(JSON.parse(user));

      const dbPath = await findDbPath();
      setDbActual(dbPath ? `SQLite/${dbPath.split("/").pop()}` : "SQLite/(no encontrada)");
    };

    cargarUsuarioYDb();
  }, []);

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    router.replace("/login");
  };

  // ✅ EXPORTAR BD: copia a cache y la comparte (WhatsApp/Drive/Mail)
  const exportarDb = async () => {
    try {
      const dbPath = await findDbPath();
      if (!dbPath) {
        Alert.alert(
          "No se encontró la base",
          `No hay base en:\n${SQLITE_DIR}\n\nTip: entrá a una pantalla que use la DB (listados) y volvé a intentar.`
        );
        return;
      }

      // Copiamos a cache para compartirla fácilmente
      const filename = dbPath.split("/").pop() || DB_NAME;
      const destino = `${FileSystem.cacheDirectory}${filename}`;

      await FileSystem.copyAsync({ from: dbPath, to: destino });

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert("No disponible", "Tu dispositivo no soporta compartir archivos.");
        return;
      }

      await Sharing.shareAsync(destino, {
        mimeType: "application/octet-stream",
        dialogTitle: "Exportar base de datos",
        UTI: "public.data",
      });
    } catch (e: any) {
      console.log("❌ Error exportando DB:", e);
      Alert.alert("Error", "No se pudo exportar la base de datos.");
    }
  };

  // ✅ IMPORTAR BD: elige un .db y lo reemplaza en SQLite/
  const importarDb = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
        type: "*/*",
      });

      if (result.canceled) return;

      const picked = result.assets?.[0];
      if (!picked?.uri) return;

      Alert.alert(
        "Importar base de datos",
        "Esto va a REEMPLAZAR la base actual del celular. ¿Continuar?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Sí, importar",
            style: "destructive",
            onPress: async () => {
              // Asegurar carpeta SQLite/
              const folderInfo = await FileSystem.getInfoAsync(SQLITE_DIR);
              if (!folderInfo.exists) {
                await FileSystem.makeDirectoryAsync(SQLITE_DIR, { intermediates: true });
              }

              // Guardamos con el nombre del archivo importado (lo más seguro)
              const filename = picked.name || DB_NAME;
              const destinoFinal = `${SQLITE_DIR}/${filename}`;

              // Si existe, borramos primero (evita errores en algunos Android)
              const existing = await FileSystem.getInfoAsync(destinoFinal);
              if (existing.exists) {
                await FileSystem.deleteAsync(destinoFinal, { idempotent: true });
              }

              await FileSystem.copyAsync({ from: picked.uri, to: destinoFinal });

              setDbActual(`SQLite/${filename}`);

              Alert.alert(
                "✅ Listo",
                "Base importada. Cerrá y abrí la app (o recargá) para que SQLite la tome."
              );
            },
          },
        ]
      );
    } catch (e: any) {
      console.log("❌ Error importando DB:", e);
      Alert.alert("Error", "No se pudo importar la base de datos.");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Configuración",
          headerStyle: { backgroundColor: "#1E88E5" },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
        }}
      />

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Configuración</Text>

        {/* 👤 Usuario */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>👤 Usuario</Text>
          <Text>Usuario: {usuario?.usuario || "-"}</Text>
          <Text>Rol: {usuario?.rol || "-"}</Text>
          <Text>Estado: Activo</Text>
        </View>

        {/* 🔔 Alertas */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🔔 Alertas</Text>

          <View style={styles.row}>
            <Text>Alertas activas</Text>
            <Switch value={alertasActivas} onValueChange={setAlertasActivas} />
          </View>

          <Text style={{ marginTop: 10 }}>Avisar con:</Text>

          <View style={styles.row}>
            {[7, 15, 30].map((dias) => (
              <TouchableOpacity
                key={dias}
                style={[
                  styles.optionButton,
                  diasAviso === dias && styles.optionSelected,
                ]}
                onPress={() => setDiasAviso(dias)}
              >
                <Text style={{ color: diasAviso === dias ? "#fff" : "#1E88E5" }}>
                  {dias} días
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 🗄️ Base de datos */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🗄️ Base de datos</Text>

          {/* 👉 Vos pediste que cualquiera pueda importar/exportar:
              entonces NO condicionamos por rol acá. */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#FFF3E0" }]}
            onPress={importarDb}
          >
            <Text style={[styles.actionText, { color: "#FB8C00" }]}>
              📥 Importar base de datos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={exportarDb}>
            <Text style={styles.actionText}>📤 Exportar base de datos</Text>
          </TouchableOpacity>

          <Text style={styles.hint}>Archivo actual: {dbActual}</Text>
        </View>

        {/* ℹ️ Información del sistema */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>ℹ️ Información del sistema</Text>
          <Text>Versión app: 1.0.0</Text>
          <Text>Backend: http://10.0.2.2:5000</Text>
          <Text>Última sincronización: {new Date().toLocaleDateString()}</Text>
        </View>

        {/* 🚪 Logout */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>🚪 Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#1E88E5", marginBottom: 20 },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 12, marginBottom: 20, elevation: 3 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  optionButton: { borderWidth: 1, borderColor: "#1E88E5", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, marginRight: 8 },
  optionSelected: { backgroundColor: "#1E88E5" },
  logoutButton: { backgroundColor: "#E53935", padding: 14, borderRadius: 10, alignItems: "center" },
  logoutText: { color: "#fff", fontWeight: "bold" },

  actionButton: {
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  actionText: {
    color: "#1E88E5",
    fontWeight: "700",
    textAlign: "center",
  },
  hint: {
    marginTop: 10,
    fontSize: 12,
    color: "#777",
    textAlign: "center",
  },
});