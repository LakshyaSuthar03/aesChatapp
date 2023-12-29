import React, { useState, useEffect } from "react";
import styles from "./chat.module.css";
import crypto from "crypto-js";
import axios from "axios";
const Chat = ({ socket, room, name }) => {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSendMsg = async () => {
    if (msg) {
      const sendMsg = {
        room: room,
        msg: msg,
        name: name,
      };
      await socket.emit("send-msg", sendMsg);
      setMessages((m) => [...m, sendMsg]);
    }
  };
  const handleLeaveChat = () => {};
  useEffect(() => {
    socket.on("broadcasted-msg", (data) => {
      const decryptedBytes = crypto.AES.decrypt(data, "secret passphrase");
      const decryptedData = JSON.parse(
        decryptedBytes.toString(crypto.enc.Utf8)
      );
      decryptedData["sender"] = true;
      setMessages((m) => [...m, decryptedData]);
    });
    return () => {
      socket.off("broadcasted-msg");
    };
  }, [socket]);

  useEffect(() => {
    axios
      .post(
        "http://localhost:3000/chats",
        {
          room: room,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((result) => {
        setMessages([]);
        result.data.map((item) => {
          const encData = item.data.encryptedData;
          const decryptedBytes = crypto.AES.decrypt(
            encData,
            "secret passphrase"
          );

          const decryptedData = JSON.parse(
            decryptedBytes.toString(crypto.enc.Utf8)
          );
          decryptedData["sender"] = true;
          setMessages((m) => [...m, decryptedData]);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [room]);

  return (
    <div className={styles.container}>
      <button
        className={`${styles.leaveChatBtn} ${styles.cta}`}
        onClick={handleLeaveChat}
      >
        Leave Chat
      </button>
      <div className={styles.messages}>
        {messages.map((item) => {
          return (
            <>
              <div className={styles.msgInner}>
                <div
                  className={
                    item.name == name ? styles.recievedMsg : styles.sentMsg
                  }
                >
                  {item.msg}

                  <div className={styles.senderName}>
                    {item.name == name ? "you" : item.name}
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
      <div className={styles.sendMsgContainer}>
        <input
          className={styles.sendMsg}
          type="text"
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
        />
        <button onClick={handleSendMsg} className={styles.cta}>
          Send
        </button>
      </div>
    </div>
  );
};
export default Chat;
