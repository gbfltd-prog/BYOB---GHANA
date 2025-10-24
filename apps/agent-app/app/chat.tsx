import { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';

export default function Chat() {
  const [conversationId, setConversationId] = useState('');
  const [message, setMessage] = useState('Hello!');

  async function send() {
    await axios.post('http://localhost:3006/api/chat/messages', { conversationId, senderId: '<agentId>', content: message }, { headers: { Authorization: 'Bearer <token>' } });
  }

  return (
    <View style={{ padding: 24 }}>
      <Text>Conversation ID</Text>
      <TextInput value={conversationId} onChangeText={setConversationId} style={{ borderWidth: 1, padding: 8 }} />
      <Text>Message</Text>
      <TextInput value={message} onChangeText={setMessage} style={{ borderWidth: 1, padding: 8 }} />
      <Button title="Send" onPress={send} />
    </View>
  );
}
