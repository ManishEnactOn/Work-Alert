import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import he from 'he';
import { useRecoilState } from 'recoil';
import { jobState } from '../atom';
import { useEffect } from 'react';
import { BackwardIcon } from '@heroicons/react/24/solid';
import { getJobsFromStorage, setJobsToStorage } from '../utils';

const CurrentJobs = () => {
  const params = useParams();

  const [jobs, setJobs] = useRecoilState(jobState);
  const [seeMore, setSeeMore] = useState([]);
  useEffect(() => {
    getJobsFromStorage().then((data) => {
      setJobsToStorage({
        jobs: data.map((a) => {
          if (a.keyword === params.id) a.__seen = true;
          return a;
        }),
      });
      setJobs(data.filter((a) => a.keyword === params.id));
      chrome.storage.local.set({
        prevJobs: data.filter((a) => a.keyword === params.id),
      });
    });
    //   chrome.storage.local.set({
    //     prevJobs: data.filter((a) => (a.seen = true)),
    //   });
    // });

    return () => {};
  }, []);

  useEffect(() => {
    setSeeMore(jobs);
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

  const handleToggleMode = (link) => {
    window.open(link);
  };

  return (
    <div className="app-container space-y-3 bg-black px-10 py-5">
      <div className="h-10 w-10 rounded-full bg-primary flex justify-center items-center ">
        <Link to={'/'}>
          <BackwardIcon className="h-5 w-5 text-white" />
        </Link>
      </div>
      <div className="space-y-2 w-1/2 ">
        {jobs &&
          jobs.map((jobs, index) => (
            <div key={index} className="bg-primary p-4 space-y-2 rounded">
              <div className="space-y-2">
                <h2 key={jobs.title} className="text-white font-bold text-lg">
                  {jobs.title.replace('- Upwork', '')}
                </h2>

                <p className="text-[rgb(153,153,153)] text-base">
                  {seeMore.find((a) => a.link === jobs.link)?.seeMore
                    ? jobs.description
                    : truncate(jobs.description)}
                </p>
              </div>
              {jobs.description?.length > 190 ? (
                <>
                  <button
                    className="text-[#66DC78] text-base"
                    onClick={() => {
                      if (seeMore.find((a) => a.link === jobs.link)?.seeMore) {
                        handleToggleMode(jobs.link);
                      } else {
                        setSeeMore((prev) => {
                          const newData = prev.map((data) => {
                            if (data.link === jobs.link) {
                              return { ...data, seeMore: !data.seeMore };
                            } else {
                              return data;
                            }
                          });
                          return newData;
                        });
                      }
                    }}
                  >
                    {seeMore.find((a) => a.link == jobs.link)?.seeMore
                      ? 'View Job Posting'
                      : ' Read More '}
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="text-[#66DC78] text-base"
                    onClick={() => {
                      handleToggleMode(jobs.link);
                    }}
                  >
                    View Job Posting
                  </button>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default CurrentJobs;
