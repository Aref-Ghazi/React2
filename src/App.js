import { useState, useEffect, useRef } from "react";
import axios from "axios";
// import "./styles.css";

export default function App() {
  const [term, setTerm] = useState("javascript");
  const [debounceSearch, setDebounceSearch] = useState(term);
  const [result, setResult] = useState([]);
  const prevTermState = useRef();

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebounceSearch(term);
    }, 1200);
    return () => clearTimeout(timeOut);
  }, [term]);

  useEffect(() => {
    prevTermState.current = term;
  }, [term]);

  useEffect(() => {
    const search = async () => {
      const respond = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          list: "search",
          origin: "*",
          format: "json",
          srsearch: debounceSearch
        }
      });
      setResult(respond.data.query.search);
    };
    search();
  }, [debounceSearch]);

  const FetchResult = result.map((el) => {
    return (
      <tr key={el.pageid}>
        <th scope="row">{el.pageid}</th>
        <td>{el.title}</td>
        <td>
          <span dangerouslySetInnerHTML={{ __html: el.snippet }} />
        </td>
      </tr>
    );
  });

  const prevTerm = prevTermState.current;
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="my-3">
            <label htmlFor="exampleFormControlInput" className="form-label">
              Search Input
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div>{prevTerm}</div>
      <div className="row">
        <div className="col">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th scope="col">title</th>
                <th scope="col">Desc</th>
              </tr>
            </thead>
            <tbody>{FetchResult}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
