import { getAllJobsData } from '../Options/apidata/api';

chrome.alarms.create({ when: 1, periodInMinutes: 0.2 });

chrome.alarms.onAlarm.addListener((data) => {
  chrome.storage.local.get('list', (result) => {
    if (result.list) {
      let keywords = Object.values(result.list);
      getAllJobsData(keywords).then((data) => {
        // console.log('AllJobsData', data);
        const incomingJobs = data;
        // const storage = previousJobs();
        // console.log('storage', storage);
      });
    }
  });
});
