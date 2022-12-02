import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { keywordState } from '../atom';

const KeyWord = () => {
  const [keyword, setKeyword] = useState('');
  const [rssLink, setRssLink] = useState('');
  const [keyWordList, setKeyWordList] = useRecoilState(keywordState);

  //   const getStorage = () => {
  //     return new Promise((resolve) => {
  //       chrome.storage.local.get('list', (result) => {
  //         console.log(result.list);
  //         resolve(result.list);
  //       });
  //     });
  //   };

  useEffect(() => {
    chrome.storage.local.get('list', (result) => {
      setKeyWordList(result.list);
    });
  }, []);

  const getJobs = () => {
    // getStorage().then((res) => setKeyWordList(res));
    setKeyWordList((prev) => [
      ...prev,
      {
        text: keyword,
      },
    ]);
    setKeyword('');
    setStorage();
  };

  const setStorage = () => {
    chrome.storage.local.set({ list: keyWordList });
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
            onClick={getJobs}
          >
            Add New KeyWord
          </button>
        </div>
        <section className="mt-1">
          {keyWordList &&
            keyWordList.map((list) => (
              <div key={list.text}>
                <div className="border">
                  <h5 className="p-1">{list.text}</h5>
                </div>
              </div>
            ))}
        </section>
      </div>
    </>
  );
};

export default KeyWord;
