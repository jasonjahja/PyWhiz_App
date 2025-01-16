import { Image, StyleSheet, ScrollView } from "react-native";
import Navbar from "@/components/ui/Navbar";

import { Text, View } from "react-native";

export default function LandingPage() {
  return (
    <View style={styles.container}>
      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Navbar />

        <View style={styles.content}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.mainTitle}>Learn Python</Text>
            <Text style={styles.subTitle}>Today!</Text>
            <Text style={styles.description}>
              Learn Python in a simple and enjoyable way, one step at a time,
              and boost your skills in just a few minutes each day.
            </Text>
          </View>

          {/* Image Grid */}
          <View style={styles.imageGrid}>
            <Image
              source={require("@/assets/images/python-logo-large.png")}
              style={styles.pythonLogo}
            />

            <View style={styles.smallImagesContainer}>
              {/* Smaller Images */}
              <Image
                source={require("@/assets/images/code-sample-1.png")}
                style={styles.smallImage}
              />
              <Image
                source={require("@/assets/images/code-sample-2.png")}
                style={styles.smallImage}
              />
              <Image
                source={require("@/assets/images/workspace.png")}
                style={styles.smallImage}
              />
              <Image
                source={require("@/assets/images/developer.png")}
                style={styles.smallImage}
              />
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made by Jason Jahja (18222116) - Anindita Widya Santoso (18222128)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center", // Center the app horizontally
    justifyContent: "center", // Center the app vertically
  },
  scrollView: {
    width: 375,
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 124,
  },
  content: {
    flex: 1,
    flexDirection: "column",
    padding: 32,
    gap: 62,
  },
  heroSection: {
    flex: 3,
    justifyContent: "center",
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#333",
    lineHeight: 52,
  },
  subTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#3178C6",
    marginBottom: 18,
    lineHeight: 52,
  },
  description: {
    fontSize: 18,
    color: "#333",
    lineHeight: 24,
  },
  imageGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  pythonLogo: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
    marginBottom: 32,
  },
  smallImage: {
    width: "48%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 8,
  },
  smallImagesContainer: {
    flex: 2,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
    width: "100%",
  },
  footer: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  footerText: {
    color: "#666",
    fontSize: 14,
    lineHeight: 24,
  },
});
