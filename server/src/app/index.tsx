import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { io } from 'socket.io-client';

const SERVER_URL = 'http://192.168.1.188:3000';

const initialLeads = [
  {
    name: 'Rahul Sharma',
    email: 'rahul@gmail.com',
    phone: '9876543210',
  },
  {
    name: 'Priya Singh',
    email: 'priya@gmail.com',
    phone: '9999999999',
  },
];

export default function HomeScreen() {const [leads, setLeads] = useState(initialLeads);
useEffect(() => {
  const socket = io(SERVER_URL);

  socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
  });

  socket.on('new_lead', (lead) => {
    setLeads((currentLeads) => [lead, ...currentLeads]);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  return () => {
    socket.disconnect();
  };
}, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>META LEADS</Text>

      {leads.map((lead, index) => (
        <View style={styles.lead} key={index}>
          <Text style={styles.name}>{lead.name}</Text>
          <Text style={styles.info}>{lead.email}</Text>
          <Text style={styles.info}>{lead.phone}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 70,
  },
  title: {
    color: '#000000',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  lead: {
    backgroundColor: '#eeeeee',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  name: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    color: '#000000',
    fontSize: 16,
    marginTop: 4,
  },
});