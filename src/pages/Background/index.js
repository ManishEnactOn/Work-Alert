chrome.alarms.create({ when: 1, periodInMinutes: 0.5 });
import { getAllJobsData } from '../Options/apidata/api';
import { getJobsFromStorage } from '../Options/utils';

chrome.alarms.onAlarm.addListener(() => {
  chrome.storage.local.get(['keywordList', 'prevJobs'], (result) => {
    if (result.keywordList) {
      getAllJobsData(result.keywordList).then((data) => {
        mergeJobs({
          oldJobs: result.prevJobs || [],
          incomingJobs: data,
        }).then((merge) => {
          console.log({ curr: data, prev: result.prevJobs, merge });
          // var tmp = [...merge];
          // console.log('tmp::', tmp);
          const notification_count = merge.filter(
            (a) => !a.notification_triggered
            // && !a.__seen
          ).length;
          console.log({ notification_count });

          // console.log(
          //   'filter::',
          //   merge.filter((count) => {
          //     return count.notification_triggered === false;
          //   }).length
          // );

          if (notification_count > 0) {
            chrome.notifications.create(
              {
                title: `${notification_count.toString()} new jobs have been posted 🙌`,
                iconUrl: chrome.runtime.getURL('icon-34.png'),
                message: 'Be first to apply! 👊',
                type: 'basic',
              },
              (e) => {
                console.log('result callback:', e);
              }
            );
          }
          setTimeout(() => {
            chrome.storage.local
              .set({
                prevJobs: merge.map((a) => {
                  // if (a._seen)
                  a.notification_triggered = true;
                  return a;
                }),
              })
              .then(() => {
                console.log('value set');
              });
          }, 1000);
        });
      });
    }
  });
});

const mergeJobs = ({ oldJobs, incomingJobs }) => {
  return new Promise((resolve) => {
    if (oldJobs !== 0) {
      let newJobs = [
        ...incomingJobs.filter(
          (job) =>
            !oldJobs.find(
              (oldJob) => oldJob.uid + oldJob.keyword === job.uid + job.keyword
            )
        ),
        ...oldJobs,
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      resolve(newJobs);
    }
    resolve(incomingJobs);
  });
};
