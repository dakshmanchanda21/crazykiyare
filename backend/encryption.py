import os
import base64
from Crypto.Cipher import AES, DES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes
from dotenv import load_dotenv

load_dotenv()

AES_KEY = bytes.fromhex(os.getenv("AES_KEY"))
DES_KEY = bytes.fromhex(os.getenv("DES_KEY"))

def encrypt(data, algo):
    if algo == "AES":
        cipher = AES.new(AES_KEY, AES.MODE_CBC)
        ct = cipher.encrypt(pad(data.encode(), AES.block_size))
    elif algo == "DES":
        cipher = DES.new(DES_KEY, DES.MODE_CBC)
        ct = cipher.encrypt(pad(data.encode(), DES.block_size))
    else:
        raise ValueError("Unsupported algorithm")

    return base64.b64encode(cipher.iv + ct).decode()

def decrypt(enc_data, algo):
    raw = base64.b64decode(enc_data)
    if algo == "AES":
        iv, ct = raw[:AES.block_size], raw[AES.block_size:]
        cipher = AES.new(AES_KEY, AES.MODE_CBC, iv)
    elif algo == "DES":
        iv, ct = raw[:DES.block_size], raw[DES.block_size:]
        cipher = DES.new(DES_KEY, DES.MODE_CBC, iv)
    else:
        raise ValueError("Unsupported algorithm")

    return unpad(cipher.decrypt(ct), cipher.block_size).decode()
