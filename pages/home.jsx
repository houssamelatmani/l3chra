import { useRouter } from "next/router";

import { useEffect, useState } from "react";
function wantedForm(date) {
  return `${new Date(date).getDate()}/${
    new Date(date).getMonth() + 1
  }/${new Date(date).getFullYear()}`;
}

export default function Home() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);

  const [data, setData] = useState([]);
  const [formD, setFormD] = useState({
    time: Date.now(),
    montant: 0,
    equipe: ["houssam", "nourdine", "abdwahed"],
  });
  const [total, setTotal] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (checked) {
        setFormD((prevData) => ({
          ...prevData,
          equipe: [...prevData.equipe, value],
        }));
      } else {
        setFormD((prevData) => ({
          ...prevData,
          equipe: prevData.equipe.filter((item) => item !== value),
        }));
      }
    } else {
      setFormD((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  useEffect(() => {
    let isauth;
    if (typeof window !== "undefined") {
      isauth = window.sessionStorage.getItem("isauth");
    }
    if (isauth == "true") {
      if (router.query) {
        window.localStorage.setItem("user", JSON.stringify(router.query));
      }
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, []);

  useEffect(() => {
    if (auth) {
      fetch("/api/allData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({}),
      })
        .then(async (res) => {
          const resData = await res.json();
          setData(JSON.parse(JSON.stringify(resData.data)));
        })
        .catch((err) => console.log(err));
    }
  }, [auth]);

  function logout() {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("isauth", false);
    }
    router.push("/login");
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Access the form data from the formData state

    const dataToAdd = { ...formD, username: router.query.username };
    if (dataToAdd.montant <= 0) {
      alert("can't set montant to 0 DH ");
      return;
    }

    if (dataToAdd.equipe.length === 0) {
      alert("no one in equipe !!!");
      return;
    }

    if (!dataToAdd.equipe.includes(router.query.username)) {
      alert("you are not in equipe !!!");
      return;
    }

    fetch("/api/addData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(dataToAdd),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status !== 200) {
          alert(data.message);
          return;
        } else {
          setTimeout(() => router.reload("/home"), 1000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function deleteData(_id) {
    const ff = confirm("are you want to delete !!!");
    if (!ff) {
      return;
    }
    try {
      fetch("/api/deleteData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ _id }),
      })
        .then(async (res) => {
          const resData = await res.json();
          if (res.status !== 200) {
            alert(resData.message);
            return;
          } else {
            setTimeout(() => router.reload("/home"), 1000);
          }
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }

  function calculate() {
    try {
      fetch("/api/calculateData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ data: router.query }),
      })
        .then(async (res) => {
          const data = await res.json();
          if(res.status!==200){
            alert('calcul fail , try later !!!')
            return
          }
          alert(data.message)
          for(let elm of data.data){
            console.log(elm)
          }
          setTotal(data.data);

          return;
        })
        .catch((err) => {
          throw new Error(err);
        });
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      {auth ? (
        <>
          <div>
            welcome {router.query.username} with id {router.query.id}{" "}
            <button onClick={() => calculate()}>calculate</button>
            <button onClick={() => logout()}>logout</button>
          </div>
          <div>
            <div>
              <table>
                <thead>
                  <th>username</th>
                  <th>time</th>
                  <th>montant</th>
                  <th>equipe</th>
                  <th>action</th>
                </thead>
                <tbody>
                  {data.map((elm) => (
                    <tr key={elm._id}>
                      <td>{elm.username}</td>
                      <td>{wantedForm(elm.time)}</td>
                      <td>{elm.montant} dh</td>
                      <td>{JSON.stringify(elm.equipe)}</td>

                      <td>
                        {elm.username === router.query.username ? (
                          <>
                            <button onClick={() => deleteData(elm._id)}>
                              delete
                            </button>
                          </>
                        ) : (
                          <></>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
           

            <div>
              <h2>{router.query.username} adding ..</h2>
              <form onSubmit={(e) => handleSubmit(e)}>
                <label>montant :</label>
                <input
                  type="number"
                  name="montant"
                  placeholder="montant"
                  onChange={handleChange}
                  value={formD.montant}
                />
                <label>
                  <p>equipe:</p>
                  <span>houssam</span>
                  <input
                    type="checkbox"
                    name="equipe"
                    value="houssam"
                    onChange={handleChange}
                    checked={formD.equipe.includes("houssam")}
                  />
                  <span>nourdine</span>
                  <input
                    type="checkbox"
                    name="equipe"
                    value="nourdine"
                    onChange={handleChange}
                    checked={formD.equipe.includes("nourdine")}
                  />
                  <span>abdwahed</span>
                  <input
                    type="checkbox"
                    name="equipe"
                    value="abdwahed"
                    onChange={handleChange}
                    checked={formD.equipe.includes("abdwahed")}
                  />
                </label>
                <button type="submit">Add</button>
              </form>
            </div>
          </div>
          {total.length > 0 ? (
  <div>
    <h1>Result : </h1>
    {total.map(elm => (
      <table >
        <thead>
         {Object.keys(elm.data).map(usr=>(
          <th>{usr}</th>
         ))
         }
        </thead>
        <tbody>
          <tr>
           moyen : {elm.moyenne.toFixed(2)} || total : {elm.total.toFixed(2)}
          </tr>
          <tr>
            {Object.keys(elm.data).map(usr =>(
              <td>{elm.data[usr]}</td>
            ))
            }
          </tr>
        </tbody>
      </table>
    ))

    }
  </div>
) : (
  <></>
)}
        </>
      ) : (
        <>
          <h1>please login :(</h1>
          <div>
            <a href="/login">Login</a>
          </div>
        </>
      )}
    </>
  );
}
