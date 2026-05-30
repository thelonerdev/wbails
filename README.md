<div align="center">

# 📦 TheLonerDev/wbails

<img src="https://i.ibb.co/WWZzMfF3/mitsuya-20250529-0001.jpg" alt="wbails" width="280" style="border-radius: 16px;" />

<br/>
<br/>

> A modified, drop-in replacement for `@whiskeysockets/baileys` — extended with additional message types, simplified send helpers, and improved connection stability.

<br/>

[![npm](https://img.shields.io/badge/github:TheLonerDev%2Fwbails-CB3837?style=flat-square&logo=npm)](https://github.com/TheLonerDev/wbails)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Multi--Device-25D366?style=flat-square&logo=whatsapp)](https://whatsapp.com)
[![Node.js](https://img.shields.io/badge/Node.js-Compatible-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![Maintained](https://img.shields.io/badge/Maintained-Yes-brightgreen?style=flat-square)](https://github.com/TheLonerDev/wbails)
[![Telegram](https://img.shields.io/badge/Contact-@TheLonerD3v-2CA5E0?style=flat-square&logo=telegram)](https://t.me/TheLonerD3v)

</div>

---

## 📖 Overview

**wbails** is a modified fork of `@whiskeysockets/baileys`, packaged as a seamless drop-in replacement. It extends the original library with additional message types (orders, poll snapshots, product messages, group labels, and more), simplified send helper functions, and improved connection stability — all while maintaining full API compatibility with the original Baileys interface.

---

## 📥 Installation

Add the following to your `package.json` dependencies:

```json
"dependencies": {
  "@whiskeysockets/baileys": "github:TheLonerDev/wbails"
}
```

Then run:

```bash
npm install
```

---

## 📌 Import

```javascript
const {
  default: makeWASocket,
  // ...other options
} = require('@whiskeysockets/baileys');
```

---

## 🔌 Connecting to WhatsApp

### 📷 QR Code

```javascript
const {
  default: makeWASocket
} = require('@whiskeysockets/baileys');

const client = makeWASocket({
  browser: ['Ubuntu', 'Chrome', '20.00.1'],
  printQRInTerminal: true
});
```

---

### 📱 Phone Number (Pairing Code)

```javascript
const {
  default: makeWASocket,
  fetchLatestWAWebVersion
} = require('@whiskeysockets/baileys');

const client = makeWASocket({
  browser: ['Ubuntu', 'Chrome', '20.00.1'],
  printQRInTerminal: false,
  version: fetchLatestWAWebVersion()
  // ...other options
});

const number = "234XXXXX";

// Standard pairing
const code = await client.requestPairingCode(number.trim());

// Custom pairing code
// const code = await client.requestPairingCode(number.trim(), "YYYYYYYY");

console.log("Your pairing code: " + code);
```

---

## 💬 Extended Message Types

### 🛒 Order Message

```javascript
const fs = require('fs');
const thumbnail = fs.readFileSync('./image.jpg');

await client.sendMessage(m.chat, {
  thumbnail: thumbnail,
  message: "Order details here",
  orderTitle: "TheLonerDev Store",
  totalAmount1000: 99999,
  totalCurrencyCode: "NGN"
}, { quoted: m });
```

---

### 📊 Poll Result Snapshot Message

```javascript
await client.sendMessage(m.chat, {
  pollResultMessage: {
    name: "Poll Title",
    options: [
      { optionName: "Option 1" },
      { optionName: "Option 2" }
    ],
    newsletter: {
      newsletterName: "TheLonerDev | Channel",
      newsletterJid: "1@newsletter"
    }
  }
});
```

---

### 🛍️ Product Message

```javascript
await client.relayMessage(m.chat, {
  productMessage: {
    title: "Product Name",
    description: "Product description here",
    thumbnail: { url: "./image.jpg" },
    productId: "EXAMPLE_TOKEN",
    retailerId: "EXAMPLE_RETAILER_ID",
    url: "https://t.me/TheLonerD3v",
    body: "Product body text",
    footer: "Footer text",
    buttons: [
      {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: "View Product",
          url: "https://t.me/TheLonerD3v"
        })
      }
    ],
    priceAmount1000: 99999,
    currencyCode: "NGN"
  }
});
```

---

### 🏷️ Member Label Message

```javascript
await client.sendMessage(m.chat, {
  groupLabel: {
    labelText: "Label text for tagged member"
  }
});
```

---

### 👥 Broadcast Message to Group Members

```javascript
await client.sendMessageMembers(m.chat, {
  extendedTextMessage: {
    text: "Hello, everyone!"
  }
}, {});
```

---

## ⚡ Simple Send Helpers

All helpers support an optional `contextInfo` object and a `quoted` key for status attribution.

### 💬 Text

```javascript
await client.sendText(m.chat, "Hello World", {
  contextInfo: {
    mentionedJid: [m.chat]
  }
}, {
  key: {
    remoteJid: "status@broadcast",
    participant: m.sender,
    fromMe: true
  },
  message: { conversation: "\0" }
});
```

---

### 🖼️ Image

```javascript
await client.sendImage(m.chat, { url: "./image.jpg" }, "Caption here", {
  contextInfo: {
    mentionedJid: [m.chat]
  }
}, {
  key: {
    remoteJid: "status@broadcast",
    participant: m.sender,
    fromMe: true
  },
  message: { conversation: "\0" }
});
```

---

### 🎬 Video

```javascript
await client.sendVideo(m.chat, { url: "./video.mp4" }, "Caption here", {
  contextInfo: {
    mentionedJid: [m.chat]
  }
}, {
  key: {
    remoteJid: "status@broadcast",
    participant: m.sender,
    fromMe: true
  },
  message: { conversation: "\0" }
});
```

---

### 🎵 Audio

```javascript
await client.sendAudio(m.chat, { url: "./audio.mp3" }, {
  contextInfo: {
    mentionedJid: [m.chat]
  }
}, {
  key: {
    remoteJid: "status@broadcast",
    participant: m.sender,
    fromMe: true
  },
  message: { conversation: "\0" }
});
```

---

### 📍 Location

```javascript
await client.sendLocation(
  m.chat,
  "Location Label",
  90.0,                         // latitude
  90.0,                         // longitude
  "https://t.me/TheLonerD3v",
  "1234567890",
  {
    contextInfo: {
      mentionedJid: [m.chat]
    }
  },
  {
    key: {
      remoteJid: "status@broadcast",
      participant: m.sender,
      fromMe: true
    },
    message: { conversation: "\0" }
  }
);
```

---

### 📋 Poll

```javascript
await client.sendPoll(
  m.chat,
  "Poll question here",
  ["Option 1", "Option 2", "Option 3"],
  true,                         // allow multiple answers
  {
    contextInfo: {
      mentionedJid: [m.chat]
    }
  },
  {
    key: {
      remoteJid: "status@broadcast",
      participant: m.sender,
      fromMe: true
    },
    message: { conversation: "\0" }
  }
);
```

---

### 🧠 Quiz

```javascript
await client.sendQuiz(
  m.chat,
  "Quiz question here",
  ["Option 1", "Option 2", "Option 3"],
  "Option 2",                   // correct answer
  {
    contextInfo: {
      mentionedJid: [m.chat]
    }
  },
  {
    key: {
      remoteJid: "status@broadcast",
      participant: m.sender,
      fromMe: true
    },
    message: { conversation: "\0" }
  }
);
```

---

### 📢 Status Mention

```javascript
await client.statusMention(m.chat, {
  extendedTextMessage: {
    text: "Status text here"
  }
});
```

---

## 👤 Developer

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/TheLonerDev">
        <img src="https://i.ibb.co/WWZzMfF3/mitsuya-20250529-0001.jpg" width="90px" style="border-radius:50%;" alt="TheLonerDev"/>
        <br />
        <sub><b>TheLonerDev</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 📬 Contact & Community

- **Telegram**: [@TheLonerD3v](https://t.me/TheLonerD3v)
- **WhatsApp Channel**: [Follow Here](https://whatsapp.com/channel/0029Vb7LYgDLY6dDPhNlvi12)

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://t.me/TheLonerD3v">TheLonerDev</a> — <b>TheLonerDev/wbails</b> · A smarter Baileys.</sub>
</div>
