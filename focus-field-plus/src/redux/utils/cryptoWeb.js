const encoder = new TextEncoder();
const decoder = new TextDecoder();

function getCrypto() {
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    return window.crypto;
  }
  throw new Error("Web Crypto API non disponibile nel contesto attuale");
}

async function deriveKey(password, salt) {
  const crypto = getCrypto();
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveKey"]);

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptContent(plainText, password) {
  const crypto = getCrypto();

  if (!plainText || typeof plainText !== "string" || plainText.trim() === "") {
    console.warn("Testo vuoto o non valido. Nessuna cifratura eseguita.");
    return "";
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encoder.encode(plainText)
  );

  return btoa(
    JSON.stringify({
      iv: Array.from(iv),
      salt: Array.from(salt),
      data: Array.from(new Uint8Array(encrypted)),
    })
  );
}

export async function decryptContent(encryptedBase64, password) {
  const crypto = getCrypto();

  try {
    if (!encryptedBase64 || typeof encryptedBase64 !== "string" || !encryptedBase64.startsWith("ey")) {
      return encryptedBase64;
    }
    const { iv, salt, data } = JSON.parse(atob(encryptedBase64));
    const key = await deriveKey(password, new Uint8Array(salt));

    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv),
      },
      key,
      new Uint8Array(data)
    );

    return decoder.decode(decrypted);
  } catch (err) {
    console.error("Errore nella decriptazione:", err);
    return "[Errore nella decriptazione]";
  }
}
