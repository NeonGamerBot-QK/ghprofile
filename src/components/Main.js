/* eslint-disable jsx-a11y/anchor-is-valid */
// eslint-disable-next-line jsx-a11y/anchor-is-valid

import { useState } from "react";
import {
  GoGlobe,
  GoRepo,
  GoLink,
  GoOrganization,
  GoPeople,
  GoMail,
  GoLocation,
  GoCodeSquare,
  GoArrowRight,
  GoArrowLeft,
  GoRepoForked
} from "react-icons/go";
import Repo from "../Repo.svg";
const electron = window.electron;
const Repos = ({ repos }) => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(4);
  return (
    <div>
      <h2 className=" font-bold text-2xl mb-2">Repos</h2>
      <ul
        className="shadow-lg rounded-xl p-5"
        style={{ listStyleImage: `url(${Repo})` }}
      >
        {repos.slice(min, max).map(repo => {
          return (
            <li key={repo.id}>
              {repo.fork
                ? <GoRepoForked className="inline-block" />
                : null}{" "}
              <a onClick={() => electron.clickOnLink(repo.html_url)}>
                {repo.name}
              </a>
            </li>
          );
        })}
      </ul>
      <button
        onClick={() => {
          setMin(min - 4);
          setMax(max - 4);
        }}
        disabled={min <= 0}
        className="btn btn-primary m-2"
      >
        <GoArrowLeft />
      </button>
      <button
        onClick={() => {
          setMin(min + 4);
          setMax(max + 4);
        }}
        disabled={max >= repos.length}
        className="btn btn-primary m-2"
      >
        <GoArrowRight />
      </button>
    </div>
  );
};
export default function Main() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = e => {
    setSearch(e.target.value);
  };
  const handleSubmit = e => {
    if (result) setResult(null);
    setLoading(true);
    fetch(`https://api.github.com/search/users?q=${search}`)
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setError(data.message);
          setLoading(false);
          return;
        }
        console.debug(data);
        if (data.items.length === 0) {
          setError("No results found");
          setLoading(false);
          return;
        }
        setSearchResults(data.items);
        setLoading(false);
        setError(null);
      });
  };
  const loadData = login => async e => {
    setLoading(true);
    const repos = await fetch(
      `https://api.github.com/users/${login}/repos`
    ).then(r => r.json());
    fetch(`https://api.github.com/users/${login}`)
      .then(res => res.json())
      .then(data => {
        data.repos = repos;
        console.debug(data);
        setSearchResults([]);
        setResult(data);
        setLoading(false);
        setError(null);

      });
  };
  return (
    <div>
      <h1 className="text-5xl font-bold mb-10">Search For user</h1>
      <div>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-base-content sr-only"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-base-300 rounded-lg bg-base-200 focus:ring-base-500 focus:border-base-500 dark:bg-base-700 dark:border-base-600 dark:placeholder-base-400 dark:text-white dark:focus:ring-base-500 dark:focus:border-base-500"
            placeholder="NeonGamerBot.."
            required
            onInput={handleSearch}
          />
          <button
            type="submit"
            className="text-white absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 bg-primary"
            onClick={handleSubmit}
          >
            Search
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error &&
        <h1 className="text-red-700 hover:text-red-600 font-bold text-3xl mt-5">
          {error}
        </h1>}
      {searchResults.length > 0 &&
        <div
          className="grid grid-cols-2  lg:grid-cols-3 p-5 mt-2 border-20 rounded-lg shadow-xl"
          style={{ overflow: "hidden" }}
        >
          {searchResults.map(item =>
            <div
              className="card  bg-base-200 hover:bg-base-100 shadow-xl lg:m-10 md:m-5 m-2 transition duration-500 ease-in-out transform hover:-translate-y-1 lg:hover:scale-110 hover:scale-105 overflow-hidden"
              key={item.id}
            >
              <figure className="px-10 pt-10">
                <img
                  src={item.avatar_url}
                  alt={item.login}
                  className="rounded-xl mask mask-circle h-32 w-32"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">
                  {item.login}
                </h2>
                <div className="card-actions">
                  <button
                    className="btn btn-primary"
                    onClick={loadData(item.login)}
                  >
                    Select
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => electron.clickOnLink(item.html_url)}
                  >
                    User on github
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>}

      {result &&
        <div className="card  bg-base-100 shadow-xl lg:m-10 md:m-5 m-2 transition duration-500 ease-in-out transform hover:-translate-y-1 lg:hover:scale-110 hover:scale-105 overflow-hidden">
          <figure>
            <img
              src={result.avatar_url}
              alt={result.login}
              className="rounded-xl mask mask-circle h-1/2 w-4/6 mt-5"
            />
          </figure>
          <div className="card-body items-center text-center">
            <h1 className="text-slate-300 hover:text-slate-50 duration-500 ease-linear card-title">
              {result.login} ({result.name})
            </h1>
            <p>
              {result.bio}
            </p>
            <div className="grid grid-cols-2 shadow-lg rounded-xl border border-gray-900 p-2 m-2">
              <div>
                <p>
                  {result.email
                    ? <a
                        onClick={() =>
                          electron.clickOnLink(`mailto:${result.email}`)}
                      >
                        <GoMail className="inline-block hover:animate-spin" />{" "}
                        {result.email}
                      </a>
                    : <span>No public email</span>}
                </p>
                {result.blog
                  ? <p>
                      <GoGlobe className="inline-block hover:animate-spin" />{" "}
                      <a
                        onClick={() => electron.clickOnLink(result.blog)}
                        className="text-blue-700 hover:text-blue-600 duration-300 ease-linear"
                      >
                        {result.blog}
                      </a>
                    </p>
                  : null}

                {result.company
                  ? <p>
                      <GoOrganization className="inline-block hover:animate-spin" />{" "}
                      <a
                        onClick={() =>
                          electron.clickOnLink(
                            "https://github.com/" + result.company.split("@")[1]
                          )}
                        className="text-white-800 hover:text-white-600"
                      >
                        {result.company}
                      </a>
                    </p>
                  : null}
                {result.location
                  ? <p>
                      <GoLocation className="inline-block hover:animate-spin" />{" "}
                      {result.location}
                    </p>
                  : null}
              </div>
              <div>
                <p>
                  <GoPeople className="inline-block hover:animate-spin" />{" "}
                  {result.followers} followers
                </p>
                <p>
                  <GoPeople className="inline-block hover:animate-spin" />{" "}
                  {result.following} people followed
                </p>
                <p>
                  <GoRepo className="inline-block hover:animate-spin" />{" "}
                  {result.public_repos} (public)
                </p>
                <p>
                  <GoCodeSquare className="inline-block hover:animate-spin" />{" "}
                  {result.public_gists} (public)
                </p>
              </div>
            </div>
            <Repos repos={result.repos} />

            <div className="card-actions">
              <button
                className="btn btn-primary"
                onClick={() => electron.clickOnLink(result.html_url)}
              >
                <GoLink className="inline-block hover:animate-spin" /> User on
                github
              </button>
            </div>
          </div>
        </div>}
    </div>
  );
}
