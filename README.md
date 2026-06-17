<div align="center">

<img src="https://files.catbox.moe/wnue26.jpg" alt="wbails" width="130" style="border-radius:20px;" />

<br/>
<br/>

# 📦 wbails `v1.0.8`

**A modified fork of `@whiskeysockets/baileys` — extended with new message types, cleaner send helpers, and better connection stability. Drop it in. Nothing breaks.**

<br/>

[![GitHub](https://img.shields.io/badge/github:TheLonerDev%2Fwbails-CB3837?style=flat-square&logo=npm)](https://github.com/TheLonerDev/wbails)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Multi--Device-25D366?style=flat-square&logo=whatsapp)](https://whatsapp.com)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.0.0-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](https://opensource.org/licenses/MIT)
[![Maintained](https://img.shields.io/badge/Maintained-Yes-brightgreen?style=flat-square)](https://github.com/TheLonerDev/wbails)
[![Telegram](https://img.shields.io/badge/Contact-@TheLonerD3v-2CA5E0?style=flat-square&logo=telegram)](https://t.me/TheLonerD3v)

</div>

---

## 🔍 What's different from vanilla Baileys

wbails is a fully compatible replacement. Everything you already write keeps working. On top of that you get:

- 💬 **Send helpers** — `sendText`, `sendImage`, `sendVideo`, `sendAudio`, `sendDocument`, `sendLocation`, `sendPoll`, `sendQuiz`, `sendPtv`, `statusMention`
- 📨 **Extended `sendMessage` types** — order messages, poll result snapshots, product messages, interactive messages, album messages, event messages, group status, and group member labels
- 📣 **`sendMessageMembers`** — send a message directly to each member of a group, with configurable delay
- 🔗 **Improved stability** — better reconnection handling so your bot stays connected

---

## 📥 Installation

Add to your `package.json`:

```json
"dependencies": {
  "@whiskeysockets/baileys": "github:TheLonerDev/wbails"
}
```

Then install:

```bash
npm install
```

**Requirements:** Node.js `>= 20.0.0`

---

## 📌 Import

Same import path as the original — no changes needed:

```js
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestWAWebVersion,
  // ...any other Baileys export works as before
} = require('@whiskeysockets/baileys');
```

---

## 🔌 Connecting to WhatsApp

### 📷 QR Code

Scan with your phone camera via **WhatsApp > Linked Devices > Link a Device**.

```js
const { state, saveCreds } = await useMultiFileAuthState('./auth');

const client = makeWASocket({
  auth: state,
  browser: ['Ubuntu', 'Chrome', '20.00.1'],
  printQRInTerminal: true
});

client.ev.on('creds.update', saveCreds);
```

---

### 📱 Pairing Code

No camera needed. Enter the code on your phone via **WhatsApp > Linked Devices > Link with phone number**.

```js
const { state, saveCreds } = await useMultiFileAuthState('./auth');

const client = makeWASocket({
  auth: state,
  browser: ['Ubuntu', 'Chrome', '20.00.1'],
  printQRInTerminal: false,
  version: await fetchLatestWAWebVersion()
});

client.ev.on('creds.update', saveCreds);

// Call this after the socket opens (connection.update event fires first)
client.ev.on('connection.update', async ({ connection }) => {
  if (connection === 'close') return;

  const code = await client.requestPairingCode('234XXXXXXXXX'); // full number, no +
  console.log('Pairing code:', code);
});

// Custom 8-character code (optional):
// const code = await client.requestPairingCode('234XXXXXXXXX', 'MYCOD123');
```

---

## ⚡ Send Helpers

These are shorthand wrappers around `sendMessage`. They all support an optional `options` object for passing `contextInfo`, and a `quoted` message as the last argument.

---

### 💬 `sendText(jid, text, options?, quoted?)`

Send a plain text message.

```js
await client.sendText(m.chat, 'Hello!');

// With a mention
await client.sendText(m.chat, '@user Hello!', {
  contextInfo: { mentionedJid: ['2341234567890@s.whatsapp.net'] }
});

// Quoting a message
await client.sendText(m.chat, 'This is a reply', {}, m);
```

---

### 🖼️ `sendImage(jid, image, caption?, options?, quoted?)`

Send an image from a file path, URL, or buffer.

```js
// From URL
await client.sendImage(m.chat, { url: 'https://example.com/photo.jpg' }, 'Check this out');

// From local file
await client.sendImage(m.chat, { url: './image.jpg' }, 'Caption here');

// From buffer
const buf = fs.readFileSync('./image.jpg');
await client.sendImage(m.chat, buf, 'Caption here', {}, m);
```

---

### 🎬 `sendVideo(jid, video, caption?, options?, quoted?)`

Send a video from a file path or URL.

```js
await client.sendVideo(m.chat, { url: './video.mp4' }, 'Watch this');

// Quoted reply
await client.sendVideo(m.chat, { url: 'https://example.com/clip.mp4' }, 'Caption', {}, m);
```

---

### 🎵 `sendAudio(jid, audio, options?, quoted?)`

Send an audio file. WhatsApp renders it as a voice note if the file is a valid opus/ogg.

```js
await client.sendAudio(m.chat, { url: './audio.mp3' });

// As a quoted reply
await client.sendAudio(m.chat, { url: './voice.ogg' }, {}, m);
```

---

### 📄 `sendDocument(jid, document, fileName, caption?, options?, quoted?)`

Send any file as a document attachment.

```js
await client.sendDocument(
  m.chat,
  { url: './report.pdf' },
  'report.pdf',
  'Here is the file'
);

// With a quoted message
await client.sendDocument(m.chat, { url: './data.csv' }, 'data.csv', '', {}, m);
```

---

### 📍 `sendLocation(jid, name, longitude, latitude, url?, address?, options?, quoted?)`

Send a location pin with an optional label, URL, and address.

```js
await client.sendLocation(
  m.chat,
  'Eiffel Tower',
  2.2945,     // longitude
  48.8584,    // latitude
  'https://maps.google.com/?q=Eiffel+Tower',
  'Champ de Mars, Paris'
);
```

---

### 📋 `sendPoll(jid, name, options[], multiSelect?, options?, quoted?)`

Create a poll. Set `multiSelect` to `true` to allow multiple answers.

```js
// Single answer
await client.sendPoll(m.chat, 'Favourite language?', ['JavaScript', 'Python', 'Go'], false);

// Multiple answers allowed
await client.sendPoll(m.chat, 'Pick your stack', ['Node', 'React', 'Postgres', 'Redis'], true);
```

---

### 🧠 `sendQuiz(jid, name, options[], answer, options?, quoted?)`

Like a poll, but with a correct answer that WhatsApp reveals after voting.

```js
await client.sendQuiz(
  m.chat,
  'What does JS stand for?',
  ['Java Script', 'Just Syntax', 'JSON Stream'],
  'Java Script' // must match one of the option strings exactly
);
```

---

### 📹 `sendPtv(jid, ptv, options?, quoted?)`

Send a PTV (short video clip rendered inline, like a video note).

```js
await client.sendPtv(m.chat, { url: './clip.mp4' });
```

---

### 📢 `statusMention(jid, content)`

Reply to a user's WhatsApp status on their behalf. The `content` is a raw message object.

```js
await client.statusMention(m.sender, {
  extendedTextMessage: { text: 'Nice status!' }
});

// With an image
await client.statusMention(m.sender, {
  imageMessage: { url: './reply.jpg', caption: 'This one' }
});
```

---

## 💬 Extended `sendMessage` Types

These are passed as the `content` argument to `sendMessage`. wbails detects the type automatically and handles the underlying relay.

---

### 💳 Payment Request — `requestPaymentMessage`

Request a payment from a user, optionally with a note or sticker.

```js
await client.sendMessage(m.chat, {
  requestPaymentMessage: {
    amount: 500000,
    currency: 'NGN',
    expiry: 0,           // 0 = no expiry
    from: m.sender,
    note: 'Payment for services'
  }
}, { quoted: m });
```

---

### 🛒 Order Message — `orderMessage`

Send a WhatsApp order card that appears as a shop order in the chat.

```js
const thumbnail = fs.readFileSync('./product.jpg');

await client.sendMessage(m.chat, {
  orderMessage: {
    thumbnail,                   // Buffer or null
    itemCount: 3,
    message: 'Your order summary',
    orderTitle: 'TheLonerDev Store',
    totalAmount1000: 150000,
    totalCurrencyCode: 'NGN'
  }
}, { quoted: m });
```

---

### 📊 Poll Result Snapshot — `pollResultMessage`

Display a poll result card, optionally attributed to a newsletter channel.

```js
await client.sendMessage(m.chat, {
  pollResultMessage: {
    name: 'Best Framework?',
    pollVotes: [
      { optionName: 'Express', optionVoteCount: 42 },
      { optionName: 'Fastify', optionVoteCount: 17 },
      { optionName: 'Hono',    optionVoteCount: 31 }
    ],
    newsletter: {
      newsletterName: 'TheLonerDev | Channel',
      newsletterJid: '120363424566516225@newsletter'
    }
  }
});
```

---

### 🛍️ Product Message — `productMessage`

Render a rich product card with price, description, and a CTA button.

```js
await client.sendMessage(m.chat, {
  productMessage: {
    title: 'Premium Bot Script',
    description: 'Full-featured WhatsApp bot with all plugins included.',
    thumbnail: { url: './product.jpg' },  // or a Buffer
    productId: 'BOT_SCRIPT_V2',
    retailerId: 'THELONER_STORE',
    url: 'https://t.me/TheLonerD3v',
    body: 'Limited stock available.',
    footer: 'DM to order.',
    buttons: [
      {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({
          display_text: 'View Product',
          url: 'https://t.me/TheLonerD3v'
        })
      }
    ],
    priceAmount1000: 500000,
    currencyCode: 'NGN'
  }
});
```

---

### 🎛️ Interactive Message — `interactiveMessage`

Send a message with quick-reply or URL buttons and an optional image/video/document header.

```js
await client.sendMessage(m.chat, {
  interactiveMessage: {
    title: 'Pick an option',
    body: 'Tap a button below to continue.',
    footer: 'Powered by wbails',
    image: { url: './banner.jpg' },  // optional: image, video, document, or thumbnail
    buttons: [
      {
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({ display_text: '✅ Accept', id: 'accept' })
      },
      {
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({ display_text: '❌ Decline', id: 'decline' })
      },
      {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({ display_text: '🌐 Open Website', url: 'https://t.me/TheLonerD3v' })
      }
    ]
  }
}, { quoted: m });
```

---

### 🖼️ Album Message — `albumMessage`

Send a group of images or videos as a single album (like WhatsApp's native multi-media send).

```js
await client.sendMessage(m.chat, {
  albumMessage: [
    { image: { url: './photo1.jpg' }, caption: 'First shot' },
    { image: { url: './photo2.jpg' }, caption: 'Second shot' },
    { video: { url: './clip.mp4'  }, caption: 'Behind the scenes' }
  ]
}, { quoted: m });
```

---

### 📅 Event Message — `eventMessage`

Create a WhatsApp event card with a name, time, location, and join link.

```js
await client.sendMessage(m.chat, {
  eventMessage: {
    name: 'Bot Dev Meetup',
    description: 'A casual session on building WhatsApp bots with Baileys.',
    location: {
      degreesLatitude: 6.5244,
      degreesLongitude: 3.3792,
      name: 'Lagos, Nigeria'
    },
    joinLink: 'https://t.me/TheLonerD3v',
    startTime: Date.now(),
    endTime: Date.now() + 7200000,  // 2 hours later
    extraGuestsAllowed: true,
    isCanceled: false
  }
}, { quoted: m });
```

---

### 📖 Group Status — `groupStatus`

Post a status-style message inside a group.

```js
await client.sendMessage(m.chat, {
  groupStatus: {
    text: 'Welcome to the group! Read the rules in the description.'
  }
});

// Or with media
await client.sendMessage(m.chat, {
  groupStatus: {
    image: { url: './banner.jpg' },
    caption: 'New rules effective today.'
  }
});
```

---

### 🏷️ Group Member Label — `groupLabel`

Tag a group member with a label (groups only, max 30 characters).

```js
// Must be used in a group JID ending in @g.us
await client.sendMessage(m.chat, {
  groupLabel: {
    labelText: 'Top Contributor'
  }
});
```

---

## 📣 `sendMessageMembers(jid, message, options?)`

Send a raw message object directly to every member (or every admin) of a group, one by one with a configurable delay between sends.

```js
await client.sendMessageMembers(
  m.chat,
  {
    extendedTextMessage: { text: 'Hello everyone, meeting starts in 10 minutes.' }
  },
  {
    delayMs: 1500,
    onlyMember: true,    // true = send to admins only, false = all members
    quoted: m
  }
);
```

> **Note:** `sendMessageMembers` takes the raw message content format (the inner object), not the shorthand format used by `sendMessage`.

---

## 👤 Developer

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/TheLonerDev">
        <img src="https://files.catbox.moe/1jr6zk.jpg" width="90" style="border-radius:50%;" />
        <br/><br/>
        <b>TheLonerDev</b>
      </a>
    </td>
  </tr>
</table>

**Telegram:** [@TheLonerD3v](https://t.me/TheLonerD3v)  
**WhatsApp Channel:** [Follow here](https://whatsapp.com/channel/0029Vb7LYgDLY6dDPhNlvi12)

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://t.me/TheLonerD3v">TheLonerDev</a> · <b>wbails v1.0.8</b> · MIT License</sub>
</div>
