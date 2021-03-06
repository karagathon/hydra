import React, { useState, useEffect } from "react";
import EventDetails from "./EventDetails";
import moment from "moment";
import { seCurrentLocation, soundNotif } from "./utils";
import EventSkeleton from "./EventSkeleton";
import { API_URL, eventSpike } from "./utils";
import axios from "axios";
import nprogress from "nprogress";
import io from "socket.io-client";
import { Link } from "react-router-dom";
import Wave from "../assets/wave.png";

const socket = io(API_URL);

const EventThread = (props: any) => {
  const [details, setDetails] = useState(false);
  const [report, setReport] = useState(null);
  const [events, setEvents] = useState(null);

  const updateMapPoints = () => {
    let laterTrigger = document.getElementById(
      "incidents-btn"
    ) as HTMLButtonElement;

    if (laterTrigger) {
      laterTrigger.click();
    }
  };

  socket.on("feedUpdate", (data) => {
    eventSpike();
    setEvents(data.data);
    localStorage.incidents = JSON.stringify(data.data);
    updateMapPoints();
    soundNotif();

    let pending = data.data.filter((x) => x.status === "PENDING");

    if (pending.length === 0) {
      setDetails(null);
    }
  });

  const fetchIncidents = () => {
    nprogress.set(0.4);
    axios.get(`${API_URL}/incidents`).then((res) => {
      setEvents(res.data);
      localStorage.incidents = JSON.stringify(res.data);
      nprogress.done();

      setTimeout(() => {
        updateMapPoints();
      }, 1000);
    });
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const toggleDetails = () => {
    setDetails(!details);
  };

  const viewIncident = (data: any) => {
    let mapBtn = document.getElementById("mapJump") as HTMLButtonElement;
    seCurrentLocation(data.coordinates);
    setReport(data);
    toggleDetails();

    if (document.contains(mapBtn)) {
      mapBtn.click();

      let targetMarker = document.querySelector(`.inm-${data.id}`);
      if (document.getElementsByClassName("marker-selected").length !== 0) {
        document
          .querySelector(".marker-selected")
          .classList.remove("marker-selected");
        targetMarker.classList.add("marker-selected");
      } else {
        targetMarker.classList.add("marker-selected");
      }
    }
  };

  return (
    <div className="event-thread">
      {!details && (
        <>
          <div className="events-header">
            <span className="text-active">
              <i className="la la-bars mr-2" />
              Recent Events
            </span>
            <Link to="/incidents">
              <button className="btn btn-sm btn-dark">
                <i className="mr-2 la la-ellipsis-h" />
                View All
              </button>
            </Link>
          </div>

          {events && events.length > 0 ? (
            events
              .filter((x) => x.status === "PENDING")
              .map((event: any) => {
                return (
                  <div
                    className="event-card"
                    onClick={() => {
                      viewIncident(event);
                    }}
                    id={`ec-${event.id}`}
                  >
                    <strong
                      className={`event-card-header ${
                        event.type === "emergency" ? "distress" : ""
                      }`}
                    >
                      <i
                        className={`la ${
                          event.type === "emergency" ? "la-bolt" : "la-fish"
                        } mr-1 text-red`}
                      />{" "}
                      {event.title}
                    </strong>
                    {event.details.trim() !== "" ? (
                      <span>
                        <strong>Details:</strong>{" "}
                        <span className="event-details">{event.details}</span>
                      </span>
                    ) : (
                      ""
                    )}
                    <span>
                      <strong>Reportee:</strong> {event.reportee}
                    </span>
                    <span>
                      <strong>Date & Time:</strong>{" "}
                      {moment(event.date).format("MMM D, YYYY - h:mm:ss A")}
                    </span>
                    <span>
                      <strong>Duration</strong> {moment(event.date).fromNow()}
                    </span>
                  </div>
                );
              })
          ) : (
            <EventSkeleton />
          )}
        </>
      )}

      {events && events.filter((x) => x.status === "PENDING").length === 0 && (
        <div className="empty-thread">
          <img src={Wave} alt="wave" className="fade-in-bottom dl-1" />
          <h1 className="fade-in-bottom dl-2">The sea is calm.</h1>
          <p className="fade-in-bottom dl-3">
            No pending reports at the moment.
          </p>

          <Link to={"/incidents"}>
            <button className="btn btn-primary fade-in-bottom dl-4">
              View History
            </button>
          </Link>
        </div>
      )}

      {details && <EventDetails goBack={toggleDetails} data={report} />}
    </div>
  );
};

export default EventThread;
