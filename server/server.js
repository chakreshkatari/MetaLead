require('dotenv').config();


const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.get('/', (req, res) => {
  res.send('Meta Leads server is running');
});

app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = 'meta_lead_poc';

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});
app.post('/webhook', async (req, res) => {
  console.log('Meta webhook received');

  res.sendStatus(200);

  try {
    const change = req.body.entry?.[0]?.changes?.[0];

    if (change?.field !== 'leadgen') {
      return;
    }

    const leadgenId = change.value.leadgen_id;

    console.log('Lead ID:', leadgenId);

    const url =
      `https://graph.facebook.com/v26.0/${leadgenId}` +
      `?fields=id,created_time,field_data` +
      `&access_token=${process.env.META_PAGE_ACCESS_TOKEN}`;

    const response = await fetch(url);
    const lead = await response.json();

    console.log('Lead data:', JSON.stringify(lead, null, 2));

    if (lead.error) {
      console.error('Meta lead retrieval failed:', lead.error);
      return;
    }

    const fields = {};

    for (const field of lead.field_data || []) {
      fields[field.name] = field.values?.[0] || '';
    }

    const newLead = {
      id: lead.id,
      name: fields.full_name || fields.name || 'Unknown',
      email: fields.email || '',
      phone: fields.phone_number || fields.phone || '',
      createdTime: lead.created_time
    };

    console.log('Sending lead to mobile:', newLead);

    io.emit('new_lead', newLead);

  } catch (error) {
    console.error('Error processing lead:', error);
  }
});
app.post('/test-lead', (req, res) => {
  const lead = {
    name: 'Amit Kumar',
    email: 'amit@gmail.com',
    phone: '8888888888',
  };

  io.emit('new_lead', lead);

  res.json(lead);
});

io.on('connection', (socket) => {
  console.log('Mobile app connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Mobile app disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});