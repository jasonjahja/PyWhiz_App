import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

const mockData = [
  { id: '1', title: 'Learn Python Basics' },
  { id: '2', title: 'Advanced Python Techniques' },
  { id: '3', title: 'Data Analysis with Python' },
  { id: '4', title: 'Web Development with Django' },
  { id: '5', title: 'Machine Learning with Python' },
];

export default function SearchPage() {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(mockData);

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = mockData.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search courses..."
        value={searchText}
        onChangeText={handleSearch}
        autoFocus={true} // Focus the input automatically
      />

      {/* Search Results */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.resultItem} onPress={() => console.log(item.title)}>
            <Text style={styles.resultText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No results found. Try another search.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
});
