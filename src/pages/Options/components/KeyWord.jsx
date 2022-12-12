import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { jobState, keywordState } from '../atom';
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
  const [jobs, setJobs] = useRecoilState(jobState);
  const [errormessage, setErrormessage] = useState(null);

  useEffect(() => {
    getKeywordFromStorage().then((data) => {
      setKeyWordList(data || []);
      fetchJobs({ keywordList: data || [] }).then(() => {
        getJobsFromStorageToSet();
      });
    });
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getKeywordFromStorage().then((data) => {
  //       setKeyWordList(data || []);
  //       fetchJobs({ keywordList: data || [] }).then((count) => {
  //         getJobsFromStorageToSet();
  //         console.log('new jobs:', count);
  //       });
  //     });
  //   }, 5000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  const AddJobsToLocalStorage = () => {
    var isKeywordExist = keyWordList.some(
      (data) => data.text.toLowerCase() == keyword.toLowerCase()
    );
    var isRSSLinkValid = rssLink.startsWith(
      'https://www.upwork.com/ab/feed/topics/rss'
    );
    console.log('isRSSLinkValid', isRSSLinkValid);
    if (!isKeywordExist)
      if (!keyword.trim() && !rssLink.trim()) {
        setErrormessage('All fields must be field');
      }
    if (!isRSSLinkValid && rssLink.trim()) {
      setErrormessage('Invalid RSS Link');
    }
    if (keyword.trim() && rssLink.trim() && isRSSLinkValid) {
      setErrormessage(null);
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
      setKeyword('');
      setRssLink('');
    }
  };

  const fetchJobs = ({ keywordList }) => {
    return new Promise((resolve) => {
      getJobsFromStorage().then((prev_data) => {
        getAllJobsData(keywordList).then((data) => {
          setJobsToStorage({
            jobs: mergeJobs({ oldJobs: prev_data || [], incomingJobs: data }),
          });
          setTimeout(() => {
            chrome.storage.local.set({
              prevJobs: mergeJobs({
                oldJobs: prev_data || [],
                incomingJobs: data,
              }),
            });
            resolve(
              mergeJobs({ oldJobs: prev_data || [], incomingJobs: data }).length
            );
          }, 50);
        });
      });
    });
  };

  const mergeJobs = ({ oldJobs, incomingJobs }) => {
    if (oldJobs !== 0) {
      let newJobs = [
        ...incomingJobs.filter(
          (job) =>
            !oldJobs.find(
              (oldJob) => oldJob.uid + oldJob.keyword === job.uid + job.keyword
            )
        ),
        ...oldJobs,
      ];
      return newJobs;
    }
    return incomingJobs;
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

  const toggleNumberOfJobs = (keyword) => {};

  const numberOfJobs = (keyword) => {
    return jobs.filter((a) => a.keyword === keyword && a.__seen === false)
      .length;
  };

  return (
    <>
      <div className="app-container">
        <div className="h-24 bg-primary px-8 flex items-center">
          <h1 className="font-bold text-lg text-[#66DC78]">
            Work<span className="text-white">Alert</span>
          </h1>
        </div>
        <div className="px-8 py-8 min-h-screen bg-black">
          <div>
            <h2 className="font-bold text-xl text-white mb-5">KEYWORDS</h2>
          </div>
          <div>
            <form
              className="space-x-3"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                type="text"
                name="keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                id="keywordText"
                placeholder="keyword"
                className="border rounded w-56 bg-primary border-white h-12 px-4 placeholder:text-base placeholder:text-[rgb(153,153,153)] caret-white text-white text-base"
              />
              <input
                type="text"
                name="rss"
                value={rssLink}
                onChange={(e) => {
                  setRssLink(e.target.value);
                }}
                id="rssLink"
                placeholder="UpWork RSS Link "
                className="border rounded w-56 bg-primary border-white h-12 px-4 placeholder:text-base placeholder:text-[rgb(153,153,153)] caret-white text-white text-base"
              />
              <h5 className="text-red-500 py-2">{errormessage}</h5>
              <div className="w-2/5 flex justify-center items-center">
                <button
                  className="font-semibold mt-4 p-2  text-base rounded text-white border-white"
                  onClick={AddJobsToLocalStorage}
                >
                  Add New KeyWord
                </button>
              </div>
            </form>
          </div>
          <section className="mt-1 space-y-1">
            {keyWordList &&
              keyWordList.map((list) => (
                <div
                  key={list.id}
                  className="border flex items-center max-w-lg h-12 bg-primary px-4 py-8 rounded  "
                >
                  <TrashIcon
                    className="h-6 w-6 cursor-pointer text-[rgb(153,153,153)]"
                    onClick={() => deleteJobs(list.id)}
                  />
                  <Link
                    to={`/currentJobs/${list.text}`}
                    className="flex items-center w-full justify-between pl-6"
                    onClick={toggleNumberOfJobs(list.text)}
                  >
                    <div>
                      <h5 className="text-[rgb(153,153,153)] text-sm">
                        Keyword
                      </h5>
                      <h5 className="text-lg w-24 text-white ">{list.text}</h5>
                    </div>
                    <span className=" h-6 w-6 rounded-full bg-[#66DC781A] text-[#66DC78] flex justify-center items-center ml-10 ">
                      {numberOfJobs(list.text)}
                    </span>
                  </Link>
                </div>
              ))}
          </section>
        </div>
      </div>
    </>
  );
};

export default KeyWord;
