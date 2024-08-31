import { useEffect } from "react";
import { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import {
  createLeads,
  getAllLeads,
  getLeads,
  updateLeads,
} from "./services/axios";
import DownloadButton from "./Download/Download";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([]);
  const [number, setNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("");
  const [nickname, setNickname] = useState("");
  const [tgName, setTgName] = useState("");
  const [email, setEmail] = useState("");
  const [bank, setBank] = useState("");
  const [price, setPrice] = useState([0]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      if (window.location.pathname === "/canva-leads/") {
        const data = await getAllLeads();
        setData(data);
      } else {
        const data = await getLeads(true);
        setData(data);
      }
    };

    fetchLeads();
  }, []);

  useEffect(() => {
    if (refresh) {
      const fetchLeads = async () => {
        if (window.location.pathname === "/canva-leads/") {
          const data = await getAllLeads();
          setData(data);
        } else {
          const data = await getLeads(true);
          setData(data);
        }
      };

      fetchLeads();
    }
  }, [refresh]);

  const totalPrice = () => {
    let total = 0;
    for (const el of data) {
      for (const item of el.price) {
        total += item;
      }
    }
    return total;
  };

  const getRowStyle = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffInDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

    if (diffInDays <= 1) {
      return "row-red";
    } else if (diffInDays < 4 && diffInDays > 1) {
      return "row-orange";
    } else {
      return "";
    }
  };

  const calculateEndDate = (startDate, duration) => {
    const date = new Date(startDate);

    date.setMonth(date.getMonth() + duration);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const sortData = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedData = [...data].sort((a, b) => {
      if (key === "price") {
        const aPrice = a.price.reduce((acc, curr) => acc + curr, 0);
        const bPrice = b.price.reduce((acc, curr) => acc + curr, 0);
        return aPrice > bPrice ? 1 : -1;
      } else {
        return new Date(a[key]) > new Date(b[key]) ? 1 : -1;
      }
    });

    if (direction === "descending") {
      sortedData.reverse();
    }

    setData(sortedData);
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name) => {
    if (!sortConfig.key || sortConfig.key !== name) return "sortable";
    return sortConfig.direction === "ascending"
      ? "sortable"
      : "sortable descending";
  };

  const allMoney = (prices) => {
    let str = "";
    for (const el of prices) {
      str += el + ";";
    }
    return str;
  };

  return (
    <>
      <header className="header">
        <NavLink to="/" className="header__link">
          Усі
        </NavLink>
        <NavLink to="/active" className="header__link">
          Активні
        </NavLink>
      </header>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <button
                type="button"
                className="add"
                onClick={() => {
                  setModalOpen(true);
                }}
              >
                Додати ліда
              </button>
              <div className="table-row table-footer">
                <div className="table-cell" colSpan="8">
                  Загальна сума
                </div>
                <div className="table-cell">{totalPrice()} грн</div>
                <div className="table-cell" colSpan="8">
                  Загальна кількість
                </div>
                <div className="table-cell">
                  {data ? data[data?.length - 1]?.number : 0} лідів
                </div>
                <DownloadButton state={true} />
              </div>
              <div className="table">
                <div className="table-row table-header">
                  <div className="table-cell">Номер</div>
                  <div
                    className={`table-cell ${getClassNamesFor("startDate")}`}
                    onClick={() => sortData("startDate")}
                  >
                    Дата початку підписки
                  </div>
                  <div
                    className={`table-cell ${getClassNamesFor("endDate")}`}
                    onClick={() => sortData("endDate")}
                  >
                    Дата закінчення підписки
                  </div>
                  <div className="table-cell">Тривалість підписки</div>
                  <div className="table-cell">Нік в тг</div>
                  <div className="table-cell">Ім`я в тг</div>
                  <div className="table-cell">email</div>
                  <div className="table-cell">Банк</div>
                  <div
                    className={`table-cell ${getClassNamesFor("price")}`}
                    onClick={() => sortData("price")}
                  >
                    Вартість підписки
                  </div>
                  <div className="table-cell">Стан</div>
                </div>
                {data.map((item, index) => (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedItem(item);
                      setModalEditOpen(true);
                    }}
                    className={`table-row ${getRowStyle(item.endDate)}`}
                    key={index}
                  >
                    <div className="table-cell">{item.number}</div>
                    <div className="table-cell">{item.startDate}</div>
                    <div className="table-cell">{item.endDate}</div>
                    <div className="table-cell">{item.duration}</div>
                    <div className="table-cell">{item.nickname}</div>
                    <div className="table-cell">{item.tgName}</div>
                    <div className="table-cell">{item.email}</div>
                    <div className="table-cell">{item.bank}</div>
                    <div className="table-cell">{allMoney(item.price)}</div>
                    <div className="table-cell">
                      {item.state ? "Підписаний" : "Відписався"}
                    </div>
                  </div>
                ))}
              </div>
              {modalEditOpen && (
                <div
                  className="table__backdrop"
                  id="backdrop"
                  onClick={(e) => {
                    if (e.target.id === "backdrop") {
                      setModalEditOpen(false);
                    }
                  }}
                >
                  <div className="table__modal">
                    <div
                      className="icon--wrapper"
                      onClick={() => {
                        setModalEditOpen(false);
                      }}
                    >
                      <div className="icon--right"></div>
                      <div className="icon--left"></div>
                    </div>
                    {/* <p className="label" style={{ marginBottom: "-10px" }}>
                      Номер формат - 1
                    </p>
                    <input
                      type="text"
                      className="table__input"
                      value={selectedItem.number}
                      placeholder="1"
                      onChange={(e) => {
                        setSelectedItem((prev) => {
                          return { ...prev, number: e.target.value };
                        });
                      }}
                    /> */}
                    <p className="label" style={{ marginBottom: "-10px" }}>
                      Дата початку підписки формат - 2024-08-19
                    </p>
                    <input
                      type="text"
                      className="table__input"
                      value={selectedItem.startDate}
                      placeholder="2024-08-19"
                      onChange={(e) => {
                        setSelectedItem((prev) => {
                          return { ...prev, startDate: e.target.value };
                        });
                      }}
                    />
                    <p className="label" style={{ marginBottom: "-10px" }}>
                      Тривалість підписки формат місяці - 3
                    </p>
                    <input
                      type="text"
                      className="table__input"
                      value={selectedItem.duration}
                      placeholder="6"
                      onChange={(e) => {
                        setSelectedItem((prev) => {
                          return { ...prev, duration: e.target.value };
                        });
                      }}
                    />
                    <p className="label" style={{ marginBottom: "-10px" }}>
                      Нік в тг формат - @nick
                    </p>
                    <input
                      type="text"
                      className="table__input"
                      value={selectedItem.nickname}
                      placeholder="@mertag_pro"
                      onChange={(e) => {
                        setSelectedItem((prev) => {
                          return { ...prev, nickname: e.target.value };
                        });
                      }}
                    />
                    <p className="label" style={{ marginBottom: "-10px" }}>
                      Ім`я в тг формат - Slava Slava
                    </p>
                    <input
                      type="text"
                      className="table__input"
                      value={selectedItem.tgName}
                      placeholder="Slava"
                      onChange={(e) => {
                        setSelectedItem((prev) => {
                          return { ...prev, tgName: e.target.value };
                        });
                      }}
                    />
                    <p className="label" style={{ marginBottom: "-10px" }}>
                      email формат - slava@mail.com
                    </p>
                    <input
                      type="text"
                      className="table__input"
                      value={selectedItem.email}
                      placeholder="mertag_nu@ukr.net"
                      onChange={(e) => {
                        setSelectedItem((prev) => {
                          return { ...prev, email: e.target.value };
                        });
                      }}
                    />
                    <p className="label" style={{ marginBottom: "-10px" }}>
                      Банк формат - приват
                    </p>
                    <input
                      type="text"
                      className="table__input"
                      placeholder="Приват"
                      value={selectedItem.bank}
                      onChange={(e) => {
                        setSelectedItem((prev) => {
                          return { ...prev, bank: e.target.value };
                        });
                      }}
                    />
                    <button
                      type="text"
                      className="apply"
                      style={{ height: "25px" }}
                      onClick={() => {
                        setSelectedItem((prev) => {
                          return { ...prev, state: !prev.state };
                        });
                      }}
                    >
                      {selectedItem.state ? "Підписаний" : "Відписаний"}
                    </button>
                    <p className="label" style={{ marginBottom: "-10px" }}>
                      Вартість підписки формат - 600
                      <span
                        className="plus"
                        onClick={(e) => {
                          setSelectedItem((prev) => {
                            return {
                              ...prev,
                              price: [...selectedItem.price, 0],
                            };
                          });
                        }}
                      >
                        +
                      </span>
                      <span
                        style={{ marginLeft: "5px" }}
                        className="plus"
                        onClick={(e) => {
                          setSelectedItem((prev) => {
                            const arr = [...prev.price];
                            arr.pop();
                            return {
                              ...prev,
                              price: arr,
                            };
                          });
                        }}
                      >
                        -
                      </span>
                    </p>
                    <div className="input__wrapper">
                      {selectedItem.price.map((item, index) => (
                        <input
                          style={
                            selectedItem.price.length > 1
                              ? { width: "22%" }
                              : { width: "100%" }
                          }
                          key={index + "price"}
                          type="text"
                          className="table__input"
                          value={selectedItem.price[index]}
                          placeholder="500"
                          // onChange={(e) => {
                          //   setPrice((prev) => {
                          //     const arr = [...prev];
                          //     arr[index] = +e.target.value;
                          //     return arr;
                          //   });
                          // }}
                          onChange={(e) => {
                            setSelectedItem((prev) => {
                              const arr = [...prev.price];
                              arr[index] = +e.target.value;
                              return {
                                ...prev,
                                price: arr,
                              };
                            });
                          }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="apply"
                      onClick={() => {
                        if (
                          selectedItem.number &&
                          selectedItem.startDate &&
                          selectedItem.duration &&
                          selectedItem.nickname &&
                          selectedItem.tgName &&
                          selectedItem.email &&
                          selectedItem.bank &&
                          selectedItem.price
                        ) {
                          updateLeads(selectedItem._id, {
                            number: selectedItem.number,
                            startDate: selectedItem.startDate,
                            endDate: calculateEndDate(
                              selectedItem.startDate,
                              +selectedItem.duration
                            ),
                            duration: selectedItem.duration,
                            nickname: selectedItem.nickname,
                            tgName: selectedItem.tgName,
                            email: selectedItem.email,
                            bank: selectedItem.bank,
                            price: selectedItem.price,
                            state: selectedItem.state,
                          });
                          // setData((prev) => [
                          //   ...prev,
                          //   {
                          //     number,
                          //     startDate,
                          //     endDate: calculateEndDate(startDate, +duration),
                          //     duration,
                          //     nickname,
                          //     tgName,
                          //     email,
                          //     bank,
                          //     price,
                          //     state: selectedItem.state,
                          //   },
                          // ]);
                          // setNumber("");
                          // setStartDate("");
                          // setDuration("");
                          // setNickname("");
                          // setTgName("");
                          // setEmail("");
                          // setBank("");
                          // setPrice([0]);
                          setModalEditOpen(false);
                        } else {
                          alert("Усі поля мають бути заповненими!");
                        }
                      }}
                    >
                      Зберегти
                    </button>
                  </div>
                </div>
              )}
              {modalOpen && (
                <div
                  className="table__backdrop"
                  id="backdrop"
                  onClick={(e) => {
                    if (e.target.id === "backdrop") {
                      setModalOpen(false);
                    }
                  }}
                >
                  <div className="table__modal">
                    <div
                      className="icon--wrapper"
                      onClick={() => {
                        setModalOpen(false);
                      }}
                    >
                      <div className="icon--right"></div>
                      <div className="icon--left"></div>
                    </div>
                    {/* <p className="label" style={{ marginBottom: "-10px" }}>
                      Номер формат - 1
                    </p>
                    <input
                      type="text"
                      className="table__input"
                      value={number}
                      placeholder="1"
                      onChange={(e) => {
                        setNumber(e.target.value);
                      }}
                    /> */}
                    <p className="label" style={{ marginBottom: "-10px" }}>
                      Дата початку підписки формат - 2024-08-19
                    </p>
                    <input
                      type="text"
                      className="table__input"
                      value={startDate}
                      placeholder="2024-08-19"
                      onChange={(e) => {
                        setStartDate(e.target.value);
                      }}
                    />
                    <p className="label" style={{ marginBottom: "-10px" }}>
                      Тривалість підписки формат місяці - 3
                    </p>
                    <input
                      type="text"
                      className="table__input"
                      value={duration}
                      placeholder="6"
                      onChange={(e) => {
                        setDuration(e.target.value);
                      }}
                    />
                    <p className="label" style={{ marginBottom: "-10px" }}>
                      Нік в тг формат - @nick
                    </p>
                    <input
                      type="text"
                      className="table__input"
                      value={nickname}
                      placeholder="@mertag_pro"
                      onChange={(e) => {
                        setNickname(e.target.value);
                      }}
                    />
                    <p className="label" style={{ marginBottom: "-10px" }}>
                      Ім`я в тг формат - Slava Slava
                    </p>
                    <input
                      type="text"
                      className="table__input"
                      value={tgName}
                      placeholder="Slava"
                      onChange={(e) => {
                        setTgName(e.target.value);
                      }}
                    />
                    <p className="label" style={{ marginBottom: "-10px" }}>
                      email формат - slava@mail.com
                    </p>
                    <input
                      type="text"
                      className="table__input"
                      value={email}
                      placeholder="mertag_nu@ukr.net"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                    <p className="label" style={{ marginBottom: "-10px" }}>
                      Банк формат - приват
                    </p>
                    <input
                      type="text"
                      className="table__input"
                      placeholder="Приват"
                      value={bank}
                      onChange={(e) => {
                        setBank(e.target.value);
                      }}
                    />
                    <p className="label" style={{ marginBottom: "-10px" }}>
                      Вартість підписки формат - 600
                      <span
                        className="plus"
                        onClick={() => {
                          setPrice((prev) => [...prev, 0]);
                        }}
                      >
                        +
                      </span>
                      <span
                        style={{ marginLeft: "5px" }}
                        className="plus"
                        onClick={() => {
                          setPrice((prev) => {
                            const arr = [...prev];
                            arr.pop();
                            return arr;
                          });
                        }}
                      >
                        -
                      </span>
                    </p>
                    <div className="input__wrapper">
                      {price.map((item, index) => (
                        <input
                          style={
                            price.length > 1
                              ? { width: "22%" }
                              : { width: "100%" }
                          }
                          key={index + "price"}
                          type="text"
                          className="table__input"
                          value={price[index]}
                          placeholder="500"
                          onChange={(e) => {
                            setPrice((prev) => {
                              const arr = [...prev];
                              arr[index] = +e.target.value;
                              return arr;
                            });
                          }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="apply"
                      onClick={async () => {
                        if (
                          // number &&
                          startDate &&
                          duration &&
                          nickname &&
                          tgName &&
                          email &&
                          bank &&
                          price
                        ) {
                          const data = await getAllLeads();
                          createLeads({
                            number: data ? data?.length + 1 : 1,
                            startDate,
                            endDate: calculateEndDate(startDate, +duration),
                            duration,
                            nickname,
                            tgName,
                            email,
                            bank,
                            price,
                            state: true,
                          });
                          setNumber("");
                          setStartDate("");
                          setDuration("");
                          setNickname("");
                          setTgName("");
                          setEmail("");
                          setBank("");
                          setPrice([0]);
                          setModalOpen(false);
                          setTimeout(() => {
                            setRefresh(true);
                          }, 1500);
                        } else {
                          alert("Усі поля мають бути заповненими!");
                        }
                      }}
                    >
                      Зберегти
                    </button>
                  </div>
                </div>
              )}
            </>
          }
        />
        <Route
          path="/active"
          element={
            <>
              <div className="table-row table-footer">
                <div className="table-cell" colSpan="8">
                  Загальна сума
                </div>
                <div className="table-cell">{totalPrice()} грн</div>
                <div className="table-cell" colSpan="8">
                  Загальна кількість
                </div>
                <div className="table-cell">{data ? data.length : 0} лідів</div>{" "}
                <DownloadButton state={false} />
              </div>
              <div className="table">
                <div className="table-row table-header">
                  <div className="table-cell">Номер</div>
                  <div
                    className={`table-cell ${getClassNamesFor("startDate")}`}
                    onClick={() => sortData("startDate")}
                  >
                    Дата початку підписки
                  </div>
                  <div
                    className={`table-cell ${getClassNamesFor("endDate")}`}
                    onClick={() => sortData("endDate")}
                  >
                    Дата закінчення підписки
                  </div>
                  <div className="table-cell">Тривалість підписки</div>
                  <div className="table-cell">Нік в тг</div>
                  <div className="table-cell">Ім`я в тг</div>
                  <div className="table-cell">email</div>
                  <div className="table-cell">Банк</div>
                  <div
                    className={`table-cell ${getClassNamesFor("price")}`}
                    onClick={() => sortData("price")}
                  >
                    Вартість підписки
                  </div>
                  <div
                    onClick={() => setModalConfirm(true)}
                    className="table-cell"
                  >
                    Стан
                  </div>
                </div>
                {data.map(
                  (item, index) =>
                    item.state && (
                      <div
                        className={`table-row ${getRowStyle(item.endDate)}`}
                        key={index}
                      >
                        <div className="table-cell">{item.number}</div>
                        <div className="table-cell">{item.startDate}</div>
                        <div className="table-cell">{item.endDate}</div>
                        <div className="table-cell">{item.duration}</div>
                        <div className="table-cell">{item.nickname}</div>
                        <div className="table-cell">{item.tgName}</div>
                        <div className="table-cell">{item.email}</div>
                        <div className="table-cell">{item.bank}</div>
                        <div className="table-cell">{item.price}</div>
                        <div className="table-cell">
                          {item.state ? "Підписаний" : "Відписався"}
                        </div>
                      </div>
                    )
                )}
              </div>
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
