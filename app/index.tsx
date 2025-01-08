import { Image, StyleSheet, Platform, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function LandingPage() {
  return (
    <ThemedView style={styles.container}>
      {/* Navigation Bar */}
      <ThemedView style={styles.navbar}>
        <Image
          source={require('@/assets/images/python-logo.png')}
          style={styles.navLogo}
        />
        <Link href="/register" asChild>
          <Pressable style={styles.signInButton} accessibilityLabel="Sign In">
            <ThemedText style={styles.signInText}>Sign In</ThemedText>
          </Pressable>
        </Link>
      </ThemedView>

      {/* Main Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <ThemedView style={styles.content}>
          {/* Hero Section */}
          <ThemedView style={styles.heroSection}>
            <ThemedText style={styles.mainTitle}>Belajar Python</ThemedText>
            <ThemedText style={styles.subTitle}>Sekarang!</ThemedText>
            <ThemedText style={styles.description}>
              Learn Python in a simple and enjoyable way, one step at a time,
              and boost your skills in just a few minutes each day.
            </ThemedText>
          </ThemedView>

          {/* Image Grid */}
          <ThemedView style={styles.imageGrid}>
            <Image
              source={require('@/assets/images/python-logo-large.png')}
              style={styles.pythonLogo}
            />

            <ThemedView style={styles.smallImagesContainer}>
              {/* Smaller Images */}
              <Image
                source={require('@/assets/images/code-sample-1.png')}
                style={styles.smallImage}
              />
              <Image
                source={require('@/assets/images/code-sample-2.png')}
                style={styles.smallImage}
              />
              <Image
                source={require('@/assets/images/workspace.png')}
                style={styles.smallImage}
              />
              <Image
                source={require('@/assets/images/developer.png')}
                style={styles.smallImage}
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Footer */}
        <ThemedView style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Made by Jason Jahja (18222116) - Anindita Widya Santoso (18222128)
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 48,
    paddingVertical: Platform.OS === 'ios' ? 48 : 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },
  navLogo: {
    width: 54,
    height: 54,
    resizeMode: 'contain',
  },
  signInButton: {
    backgroundColor: '#3178C6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 124,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    padding: 32,
    gap: 62,
  },
  heroSection: {
    flex: 3,
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 52,
  },
  subTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3178C6',
    marginBottom: 18,
    lineHeight: 52,
  },
  description: {
    fontSize: 18,
    color: '#333',
    lineHeight: 24,
  },
  imageGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pythonLogo: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 32,
  },
  smallImage: {
    width: '48%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  smallImagesContainer: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    width: '100%',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
});
