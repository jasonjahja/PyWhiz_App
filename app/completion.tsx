import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter, useGlobalSearchParams } from "expo-router";

export default function CompletionPage() {
  const router = useRouter();
  const { moduleId } = useGlobalSearchParams(); // Get moduleId from the route params

  const currentModule = parseInt(
    Array.isArray(moduleId) ? moduleId[0] : moduleId || "1"
  ); // Fallback to module 1 if moduleId is missing
  const nextModule = currentModule + 1;

  return (
    <View style={styles.container}>
      <View style={styles.widthcontainer}>
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.content}>
          You have successfully completed Module {currentModule}.
        </Text>

        <View style={styles.buttonsContainer}>
          {/* Button to go back home */}
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.push(`/home`)}
          >
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>

          {/* Button to go to the next module */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() =>
              router.push({
                pathname: `/modules`,
                params: {
                  moduleId: `${nextModule}`,
                },
              })
            }
          >
            <Text style={styles.buttonText}>Go to Module {nextModule}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  widthcontainer: Platform.select({
    web: {
      width: 375,
      justifyContent: "center",
      alignItems: "center",
    },
    default: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
  }),
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  content: {
    fontSize: 18,
    marginBottom: 32,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  nextButton: {
    backgroundColor: "#3178C6",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  homeButton: {
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
