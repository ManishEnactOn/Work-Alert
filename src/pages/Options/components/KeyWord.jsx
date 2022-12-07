import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { keywordState } from '../atom';
import { TrashIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { getAllJobsData } from '../apidata/api';
import {
  addKeywordToStorage,
  getKeywordFromStorage,
  getJobsFromStorage,
  setJobsToStorage,
} from '../utils';

const KeyWord = () => {
  const [keyword, setKeyword] = useState('');
  const [rssLink, setRssLink] = useState('');
  const [keyWordList, setKeyWordList] = useRecoilState(keywordState);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getKeywordFromStorage().then((data) => {
      setKeyWordList(data);
      fetchJobs({ keywordList: data }).then(() => {
        getJobsFromStorageToSet();
      });
    });
  }, []);

  const AddJobsToLocalStorage = () => {
    var isKeywordExist = keyWordList.some(
      (data) => data.text.toLowerCase() == keyword.toLowerCase()
    );
    if (!isKeywordExist) {
      addKeywordToStorage({
        list: [
          ...keyWordList,
          {
            id: Math.random() * 100,
            text: keyword,
            rsslink: rssLink,
          },
        ],
      });
      setKeyWordList((prev) => [
        ...prev,
        {
          id: Math.random() * 100,
          text: keyword,
          rsslink: rssLink,
        },
      ]);
      fetchJobs({
        keywordList: [
          ...keyWordList,
          {
            id: Math.random() * 100,
            text: keyword,
            rsslink: rssLink,
          },
        ],
      }).then(() => {
        getJobsFromStorageToSet();
      });
    }
    setKeyword('');
    setRssLink('');
  };

  const fetchJobs = ({ keywordList }) => {
    return new Promise((resolve) => {
      getAllJobsData(keywordList).then((data) => {
        setJobsToStorage({ jobs: data });
        setTimeout(() => {
          resolve();
        }, 50);
      });
    });
  };

  const deleteJobs = (id) => {
    addKeywordToStorage({
      list: keyWordList.filter((list) => list.id !== id),
    });
    setKeyWordList(keyWordList.filter((list) => list.id !== id));
    fetchJobs({
      keywordList: keyWordList.filter((list) => list.id !== id),
    }).then(() => {
      getJobsFromStorageToSet();
    });
  };

  const getJobsFromStorageToSet = () => {
    getJobsFromStorage().then((data) => {
      setJobs(data);
    });
  };

  const numberOfJobs = (keyword) => {
    return jobs.filter((a) => a.keyword === keyword).length;
  };

  return (
    <>
      <div className="app-container">
        <div>
          <h1 className="font-bold text-lg">Work Alert</h1>
        </div>
        <div>
          <h2 className="font-semibold text-base">KEYWORD</h2>
        </div>
        <div>
          <div className="space-x-3">
            <input
              type="text"
              name="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              id="keywordText"
              className="border-2 border-black h-9 px-1"
            />
            <input
              type="text"
              name="rss"
              value={rssLink}
              onChange={(e) => {
                setRssLink(e.target.value);
              }}
              id="rssLink"
              className="border-2 w-56 border-black h-9 px-1"
            />
          </div>
          <button
            className="font-bold mt-4 p-1 bg-purple-300 rounded "
            onClick={AddJobsToLocalStorage}
          >
            Add New KeyWord
          </button>
        </div>
        <section className="mt-1 space-y-1">
          {keyWordList &&
            keyWordList.map((list) => (
              <div
                key={list.id}
                className="border flex items-center max-w-2xl h-12"
              >
                <TrashIcon
                  className="h-6 w-6 cursor-pointer"
                  onClick={() => deleteJobs(list.id)}
                />
                <Link
                  to={`/currentJobs/${list.text}`}
                  className="flex items-center"
                >
                  <h5 className="p-1 text-xl w-24 ">{list.text}</h5>
                  <span className="p-2 border border-green-400 ml-10">
                    {numberOfJobs(list.text)}
                  </span>
                </Link>
              </div>
            ))}
        </section>
      </div>
    </>
  );
};

export default KeyWord;
