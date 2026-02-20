import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  Alert, 
  StyleSheet, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  TouchableWithoutFeedback, 
  Keyboard 
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "http://10.0.2.2:5000";

export default function Register() {
  const [form, setForm] = useState({
    usuario: "",
    password: "",
    confirmPassword: "",
  });

  const onRegister = async () => {
    // Validaciones
    if (!form.usuario || !form.password ) {
      Alert.alert("Error", "Por favor completá todos los campos");
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (form.password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario: form.usuario,
          password: form.password,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        Alert.alert("Error", data?.message || `Error ${res.status}`);
        return;
      }

      Alert.alert(
        "✅ Cuenta creada",
        "Tu cuenta ha sido creada correctamente. Ahora podés iniciar sesión.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/login")
          }
        ]
      );
    } catch (e) {
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <Image
            source={require("../assets/images/utedyc_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Título */}
          <View style={styles.header}>
            <Text style={styles.titulo}>Centro de Formación Profesional UTEDYC</Text>
            <Text style={styles.subtitulo}>Crear Nueva Cuenta</Text>
          </View>

          {/* Card del formulario */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-add-outline" size={24} color="#1E88E5" />
              <Text style={styles.cardTitle}>Registro</Text>
            </View>

            {/* Input Usuario */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Usuario"
                value={form.usuario}
                onChangeText={(t) => setForm({...form, usuario: t})}
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>

            {/* Input Contraseña */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Contraseña (mín. 6 caracteres)"
                value={form.password}
                onChangeText={(t) => setForm({...form, password: t})}
                secureTextEntry
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>

            {/* Input Confirmar Contraseña */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Confirmar contraseña"
                value={form.confirmPassword}
                onChangeText={(t) => setForm({...form, confirmPassword: t})}
                secureTextEntry
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>

            {/* Botón Crear Cuenta */}
            <Pressable
              onPress={onRegister}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed
              ]}
            >
              <Text style={styles.buttonText}>Crear Cuenta</Text>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            </Pressable>

            {/* Link a Login */}
            <Pressable 
              onPress={() => router.replace("/login")}
              style={styles.loginLink}
            >
              <Text style={styles.loginText}>
                ¿Ya tenés cuenta? <Text style={styles.loginTextBold}>Iniciar sesión</Text>
              </Text>
            </Pressable>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>© 2025 CFP UTEDYC - Sistema de Seguridad e Higiene</Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 10,
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1E88E5",
    marginBottom: 5,
  },
  subtitulo: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#FAFAFA",
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 15,
    color: "#333",
  },
  button: {
    backgroundColor: "#1E88E5",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#1E88E5",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  buttonPressed: {
    backgroundColor: "#1976D2",
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
  loginLink: {
    marginTop: 16,
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#666",
  },
  loginTextBold: {
    fontWeight: "bold",
    color: "#1E88E5",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#777",
    marginTop: 30,
  },
});