import React, { useEffect, useState } from "react";
import "../styles/Map.scss";
import Sidebar from "./Sidebar";
import { loadChart, API_URL } from "./utils";
import axios from "axios";
import moment from "moment";
import nprogress from "nprogress";

const Incidents = (props: any) => {
  const [events, setEvents] = useState(null);

  const fetchIncidents = () => {
    nprogress.set(0.4);
    axios.get(`${API_URL}/incidents`).then((res) => {
      setEvents(res.data);
      nprogress.done();
    });
  };

  const searchEvents = () => {
    let query = document.getElementById("search-events") as HTMLInputElement;
    if (query.value.trim() !== "") {
      nprogress.set(0.4);
      axios
        .get(`${API_URL}/incidents/search/?query=${query.value}`)
        .then((res) => {
          setEvents(res.data);
          nprogress.done();
        });
    } else {
      fetchIncidents();
    }
  };

  useEffect(() => {
    loadChart();
    fetchIncidents();
  }, []);

  return (
    <>
      <Sidebar active="Emergencies" />
      <div className="dashboard-content">
        <div className="content-header">
          <div className="content-nav">
            <h1>
              <i className="la la-exclamation-circle text-danger" /> Incidents
            </h1>

            <input
              placeholder="Search Incidents"
              className="search-input"
              id="search-events"
              onKeyUp={(e) => {
                if (e.keyCode === 13) {
                  searchEvents();
                }
              }}
            />
          </div>
        </div>

        <div className="row table-content">
          <div className="col-md-11">
            <div className="card bg-default shadow">
              <div className="card-header bg-transparent border-0">
                <h3 className="text-white mb-0">
                  {" "}
                  <i className="la la-fish text-warning" /> Illegal Fishing
                </h3>
                <small className="text-muted">
                  List of recorded illegal fishing activity from the network.
                </small>
              </div>
              <div className="table-responsive">
                <table className="table align-items-center table-dark table-flush">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col" className="sort" data-sort="name">
                        No.
                      </th>
                      <th scope="col" className="sort" data-sort="name">
                        Device ID
                      </th>
                      <th scope="col" className="sort" data-sort="budget">
                        Recorded Location
                      </th>
                      <th scope="col" className="sort" data-sort="status">
                        title
                      </th>
                      <th scope="col" className="sort" data-sort="status">
                        Details
                      </th>
                      <th scope="col" className="sort" data-sort="budget">
                        Reportee
                      </th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody className="list">
                    {events &&
                      events
                        .filter((x) => x.type === "illegal_fishing")
                        .map((event: any, index: number) => {
                          return (
                            <tr key={index} className="fade-in">
                              <th>
                                <strong>{index + 1}</strong>
                              </th>
                              <th>
                                <strong>{event.device_id}</strong>
                              </th>
                              <td>{event.address}</td>
                              <td>{event.title}</td>
                              <td>{event.details}</td>
                              <td>{event.reportee}</td>
                              <td>
                                <span className="badge badge-dot mr-4">
                                  {true ? (
                                    <>
                                      <i className="bg-success" />
                                      <span className="status">Active</span>
                                    </>
                                  ) : (
                                    <>
                                      <i className="bg-danger" />
                                      <span className="status">Inactive</span>
                                    </>
                                  )}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* gateway table */}
          <div className="col-md-11">
            <div className="card bg-default shadow">
              <div className="card-header bg-transparent border-0">
                <h3 className="text-white mb-0">
                  {" "}
                  <i className="la la-bolt text-warning" /> Emergencies
                </h3>
                <small className="text-muted">
                  List of recorded emergency signals or distress calls
                </small>
              </div>
              <div className="table-responsive">
                <table className="table align-items-center table-dark table-flush">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col" className="sort" data-sort="name">
                        No.
                      </th>
                      <th scope="col" className="sort" data-sort="name">
                        Device ID
                      </th>
                      <th scope="col" className="sort" data-sort="budget">
                        Recorded Location
                      </th>
                      <th scope="col" className="sort" data-sort="status">
                        Deployment Date
                      </th>
                      <th scope="col" className="sort" data-sort="budget">
                        Last Interaction
                      </th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody className="list">
                    <tr>
                      <th>
                        <strong>1</strong>
                      </th>
                      <th>
                        <strong>HG-0001</strong>
                      </th>
                      <td>
                        <strong>Pasay City</strong>
                      </td>
                      <td>June 28, 2020</td>
                      <td>June 28, 2020 (20 days ago)</td>
                      <td>
                        <span className="badge badge-dot mr-4">
                          <i className="bg-success" />
                          <span className="status">Active</span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Incidents;
