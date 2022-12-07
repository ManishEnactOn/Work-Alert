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
import { getJobsFromStorage } from '../utils';

const CurrentJobs = () => {
  const params = useParams();

  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    getJobsFromStorage().then((data) => {
      setJobs(data.filter((a) => a.keyword === params.id));
    });

    return () => {};
  }, []);

  const handleHTMLcoding = (text) => {
    return he.decode(text);
  };

  const truncate = (string) => {
    const decodedText = handleHTMLcoding(string);
    return decodedText.length > 190
      ? decodedText.substring(0, 190) + ' ...'
      : decodedText;
  };

  return (
    <>
      <Link to={'/'}>
        <BackwardIcon className="h-6 w-6" />
      </Link>
      <div className="space-y-2">
        {jobs &&
          jobs.map((jobs, index) => (
            <div key={index}>
              <div className="p-2 bg-red-300">
                <h2 key={jobs.title}>{jobs.title.replace('- Upwork', '')}</h2>
                <p> {truncate(jobs.description)}</p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default CurrentJobs;
