import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

function Todos() {
  const [dataa, setDataa] = useState([]);
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/todos")
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
          <th>title</th>
          <th>Completed</th>
        </thead>

        <tbody>
          {dataa.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>
                  {item.completed ? "True" : "False"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default Todos;
