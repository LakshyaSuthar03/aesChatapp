import React, { useState, useEffect } from "react";
import styles from "./join.module.css";
import { io } from "socket.io-client";
import Chat from "../../components/Chat/Chat";

const socket = io("http://localhost:3000/");

const Join = () => {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [joinStatus, setJoinStatus] = useState(false);
  const handleJoinRoom = () => {
    if (room && name) {
      socket.emit("join-room", { name, room, password });
      // setJoinStatus(true);
    }
  };
  useEffect(() => {
    socket.on("join-room-response", (res) => {
      console.log(res);
      if (res.status == "success") {
        setJoinStatus(true);
      } else {
        setJoinStatus(false);
      }
    });
    return () => {
      socket.off("join-room-response");
    };
  }, [socket]);

  return (
    <div className={styles.container}>
      {!joinStatus ? (
        <div className={styles.inner}>
          <input
            placeholder="room Id"
            type="text"
            name="roomId"
            value={room}
            onChange={(e) => {
              setRoom(e.target.value);
            }}
          />
          <input
            placeholder="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <input
            placeholder="user name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <button onClick={handleJoinRoom} className={styles.cta}>
            Join
          </button>
        </div>
      ) : (
        <>
          <Chat
            socket={socket}
            room={room}
            name={name}
            setJoinStatus={setJoinStatus}
          />
        </>
      )}
    </div>
  );
};

export default Join;
