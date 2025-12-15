import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

function Comments() {
  const [dataa, setDataa] = useState([]);
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/comments")
      .then((res, req) => {
        console.log(res.data);

        setDataa(res.data);
      });
  }, []);

  return (
    <>
      <table border="1" cellPadding="8">
        <thead>
          <th>id</th>
          <th>name</th>
          <th>e-mail</th>
          <th>body</th>
        </thead>

        <tbody>
          {dataa.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.body}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default Comments;
