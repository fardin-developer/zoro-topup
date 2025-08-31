import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UpcomingEvent.css";

const UpcomingEvent = () => {
  const [event, setEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get("/api/event/getevent", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        setEvent(res.data.event);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvent();
  }, []);

  useEffect(() => {
    if (event) {
      const intervalId = setInterval(() => {
        const eventTime = new Date(`${event.date}T${event.time}`).getTime();
        const currentTime = new Date().getTime();
        const difference = eventTime - currentTime;

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });

        if (difference < 0) {
          clearInterval(intervalId);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [event]);

  return (
    <div>
      {event && event?.display === "yes" && (
        <div className="event-container">
          <div className="event-img">
            <img src={`/${event?.imageUrl}`} alt={event?.name} />
          </div>
          <div className="event-content">
            <h5>{event?.heading}</h5>
            <h1>{event?.name}</h1>
            <div className="counterr">
              <span>{timeLeft?.days}d</span>
              <span>{timeLeft?.hours}h</span>
              <span>{timeLeft?.minutes}m</span>
              <span>{timeLeft?.seconds}s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingEvent;
