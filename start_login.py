import pty, os, subprocess, time, sys

master, slave = pty.openpty()
p = subprocess.Popen(["npx", "firebase-tools", "login", "--no-localhost"], stdin=slave, stdout=slave, stderr=slave, close_fds=True)
os.close(slave)
os.set_blocking(master, False)

def read_until(prompt):
    output = b""
    start = time.time()
    while time.time() - start < 15:
        try:
            data = os.read(master, 1024)
            if data:
                output += data
                if prompt in output:
                    return output
        except:
            pass
        time.sleep(0.1)
    return output

out1 = read_until(b"(Y/n)")
if b"(Y/n)" in out1:
    os.write(master, b"n\n")
    
out2 = read_until(b"(Y/n)")
if b"(Y/n)" in out2:
    os.write(master, b"n\n")
    
out3 = read_until(b"Enter authorization code:")

with open("firebase_url.txt", "wb") as f:
    f.write(out1 + out2 + out3)

while p.poll() is None:
    if os.path.exists("code.txt"):
        with open("code.txt", "r") as f:
            code = f.read().strip()
        os.remove("code.txt")
        os.write(master, code.encode() + b"\n")
        time.sleep(2)
        try:
            out4 = os.read(master, 4096)
            with open("firebase_url.txt", "ab") as f:
                f.write(out4)
        except:
            pass
        break
    time.sleep(1)
