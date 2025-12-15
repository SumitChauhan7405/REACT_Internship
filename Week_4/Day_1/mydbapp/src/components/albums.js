import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

function Albums() {
  const [dataa, setDataa] = useState([]);
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/albums")
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
        </thead>

        <tbody>
          {dataa.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.title}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default Albums;
