import React from 'react';
import { Link, useParams } from 'react-router-dom';
import XMLParser from 'fast-xml-parser';
import axios from 'axios';
import he from 'he';
import { useRecoilState } from 'recoil';
import { keywordState } from '../atom';
import { useState } from 'react';
import { useEffect } from 'react';
import { BackwardIcon } from '@heroicons/react/24/solid';

const parser = new XMLParser.XMLParser();
var getRssURl;
const CurrentJobs = () => {
  var { id } = useParams();
  const [currentJobs, setCurrentJobs] = useState([]);
  const [keyWordList, setKeyWordList] = useRecoilState(keywordState);

  //   useEffect(() => {
  //     console.log('currentJobs', currentJobs);
  //   }, [currentJobs]);

  const getCurrentJobs = async (rssLink) => {
    await axios
      .get(rssLink, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
      .then((response) => {
        const original = response?.data;
        // console.log('original', original);
        let xmlJobList = parser.parse(original);
        console.log('xmlJobList', xmlJobList);
        setCurrentJobs(xmlJobList.rss?.channel?.item);
      });
  };

  const getCurrentRssLink = (id) => {
    getRssURl = keyWordList.find((list) => {
      return list.id == id;
    });
    getCurrentJobs(getRssURl?.rsslink);
  };

  useEffect(() => {
    getCurrentRssLink(id);
  }, []);

  const handleHTMLcoding = (text) => {
    return he.decode(text);
  };

  const truncate = (string) => {
    const decodedText = handleHTMLcoding(string);
    // console.log('decodedText', decodedText);
    return decodedText.length > 190
      ? decodedText.substring(0, 190) + ' ...'
      : decodedText;
  };

  //   useEffect(() => {}, []);
  return (
    <>
      <Link to={'/'}>
        <BackwardIcon className="h-6 w-6" />
      </Link>
      {/* <h1>currentjobs page</h1> */}
      <div className="space-y-2">
        {currentJobs &&
          currentJobs.map((jobs) => (
            <>
              <div className="p-2 bg-red-300">
                <h2 key={jobs.title}>{jobs.title.replace('- Upwork', '')}</h2>
                <p> {truncate(jobs.description)}</p>
              </div>
            </>
          ))}
      </div>
    </>
  );
};

export default CurrentJobs;
