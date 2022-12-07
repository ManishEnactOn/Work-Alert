export const addKeywordToStorage = ({ list }) => {
  chrome.storage.local.set({ keywordList: list });
};

export const getKeywordFromStorage = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get('keywordList', (result) => {
      resolve(result.keywordList);
    });
  });
};

export const setJobsToStorage = ({ jobs }) => {
  chrome.storage.local.set({ jobs });
};

export const getJobsFromStorage = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get('jobs', (result) => {
      resolve(result.jobs);
    });
  });
};
