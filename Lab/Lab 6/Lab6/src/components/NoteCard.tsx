import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';

import { Note } from '../types/Note';

interface Props {
  note: Note;
  onPress: () => void;
}

const NoteCard = ({ note, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: note.color }]}
      onPress={onPress}
    >
      <Text style={styles.title}>
        {note.title || 'Untitled'}
      </Text>

      <Text numberOfLines={8} style={styles.content}>
        {note.content}
      </Text>
    </TouchableOpacity>
  );
};

export default NoteCard;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    minHeight: 150,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },

  content: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
});