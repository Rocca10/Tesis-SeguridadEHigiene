import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "http://10.0.2.2:5000";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        Alert.alert("Login", data?.message || `Error ${res.status}`);
        return;
      }

      await SecureStore.setItemAsync("token", data.token);
      await SecureStore.setItemAsync("user", JSON.stringify(data.user));

      router.replace("/(tabs)/dashboard");
    } catch (e) {
      Alert.alert("Login", "No se pudo conectar al servidor");
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
        <Text style={styles.subtitulo}>Sistema de Seguridad e Higiene</Text>
      </View>

      {/* Card del formulario */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="log-in-outline" size={24} color="#1E88E5" />
          <Text style={styles.cardTitle}>Iniciar sesión</Text>
        </View>

        {/* Input Usuario */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="Usuario"
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        {/* Input Contraseña */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        {/* Botón Entrar */}
        <Pressable
          onPress={onLogin}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={styles.buttonText}>Entrar</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </Pressable>

        {/* Link a Registro */}
        <Pressable 
          onPress={() => router.push("/register")}
          style={styles.registerLink}
        >
          <Text style={styles.registerText}>
            ¿No tenés cuenta? <Text style={styles.registerTextBold}>Crear cuenta</Text>
          </Text>
        </Pressable>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>© 2025 CFP UTEDYC</Text>
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
    width: 180,
    height: 180,
    alignSelf: "center",
    marginBottom: 10,
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  titulo: {
    fontSize: 20,
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
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#777",
    marginTop: 30,
  },
  registerLink: {
    marginTop: 16,
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: "#666",
  },
  registerTextBold: {
    fontWeight: "bold",
    color: "#1E88E5",
  },
});