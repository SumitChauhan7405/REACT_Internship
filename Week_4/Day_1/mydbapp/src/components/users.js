import React, { useEffect, useState } from "react";
import axios from "axios";

function Users() {
  const [dataa, setDataa] = useState([]);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        setDataa(res.data);
      });
  }, []);

  return (
    <>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Street</th>
            <th>Suite</th>
            <th>City</th>
            <th>Zipcode</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Phone</th>
            <th>Website</th>
            <th>Company Name</th>
            <th>Catch Phrase</th>
            <th>BS</th>
          </tr>
        </thead>

        <tbody>
          {dataa.map((item) => {
            return (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>{item.address.street}</td>
                <td>{item.address.suite}</td>
                <td>{item.address.city}</td>
                <td>{item.address.zipcode}</td>
                <td>{item.address.geo.lat}</td>
                <td>{item.address.geo.lng}</td>
                <td>{item.phone}</td>
                <td>{item.website}</td>
                <td>{item.company.name}</td>
                <td>{item.company.catchPhrase}</td>
                <td>{item.company.bs}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default Users;
