import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { keywordState } from '../atom';
import { TrashIcon } from '@heroicons/react/24/solid';
import XMLParser from 'fast-xml-parser';
import axios from 'axios';
import { Link } from 'react-router-dom';

const parser = new XMLParser.XMLParser();

const KeyWord = () => {
  const [keyword, setKeyword] = useState('');
  const [rssLink, setRssLink] = useState('');
  const [keyWordList, setKeyWordList] = useRecoilState(keywordState);
  const [newJobs, setNewJobs] = useState(0);

  const getJobs = async (rssURl) => {
    await axios
      .get(rssURl, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
      .then((response) => {
        const original = response.data;
        let xmlJobList = parser.parse(original);
        // console.log('xmlJobList', xmlJobList);
      });
  };

  useEffect(() => {
    chrome.storage.local.get('list', (result) => {
      setKeyWordList(result.list);
    });
  }, []);

  const AddJobsToLocalStorage = () => {
    var isKeywordExist = keyWordList.some(
      (data) => data.text.toLowerCase() == keyword.toLowerCase()
    );
    if (!isKeywordExist)
      setKeyWordList((prev) => [
        ...prev,
        {
          id: Math.random() * 100,
          text: keyword,
          rsslink: rssLink,
        },
      ]);
    setKeyword('');
    getJobs(rssLink);
    // setRssLink('');
  };

  useEffect(() => {
    chrome.storage.local.set({ list: keyWordList });
  }, [keyword]);

  const deleteJobs = (id) => {
    setKeyWordList(keyWordList.filter((list) => list.id !== id));
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
        <section className="mt-1">
          {keyWordList &&
            keyWordList.map((list) => (
              <div key={list.id}>
                <div className="border flex items-center max-w-2xl h-12">
                  <TrashIcon
                    className="h-6 w-6 cursor-pointer"
                    onClick={() => deleteJobs(list.id)}
                  />
                  <Link
                    to={`/currentJobs/${list.id}`}
                    className="flex items-center"
                  >
                    <h5 className="p-1 text-xl ">{list.text}</h5>
                    <span className="p-2 border border-green-400 ml-10">
                      {newJobs}
                    </span>
                  </Link>
                </div>
              </div>
            ))}
        </section>
      </div>
    </>
  );
};

export default KeyWord;
