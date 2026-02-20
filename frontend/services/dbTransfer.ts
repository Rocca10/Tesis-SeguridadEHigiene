import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

const DB_NAME = "seguridad.db"; // Si llego a querer cambiarle el nombre a la BD tengo que hacerlo aca tambien
const SQLITE_DIR = FileSystem.Paths.document + "/SQLite/";
const DB_PATH = SQLITE_DIR + DB_NAME;

// EXPORTAR
export async function exportDatabase() {
  const info = await FileSystem.getInfoAsync(DB_PATH);
  if (!info.exists) throw new Error("No existe la base en: " + DB_PATH);

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) throw new Error("Sharing no disponible en este dispositivo");

  await Sharing.shareAsync(DB_PATH);
}

// IMPORTAR
export async function importDatabase() {

  const res = await DocumentPicker.getDocumentAsync({
    type: "*/*",
    copyToCacheDirectory: true,
  });

  if (res.canceled) return;

  const picked = res.assets?.[0];
  if (!picked?.uri) throw new Error("No se pudo leer el archivo seleccionado");

  await FileSystem.makeDirectoryAsync(SQLITE_DIR, { intermediates: true });

  await FileSystem.copyAsync({
    from: picked.uri,
    to: DB_PATH,
  });

  return DB_PATH;
}

export const dbPaths = { DB_PATH, SQLITE_DIR, DB_NAME };