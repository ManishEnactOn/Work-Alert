chrome.alarms.create({
  when: 1,
  periodInMinutes: 0.5,
});
import { getAllJobsData } from '../Options/apidata/api';

chrome.alarms.onAlarm.addListener((data) => {
  chrome.storage.local.get(['keywordList', 'prevJobs'], (result) => {
    console.log('prevJobs', result.prevJobs);
    if (result.keywordList) {
      getAllJobsData(result.keywordList).then((incomingJobs) => {
        console.log('incomingJobs', incomingJobs);
        var merge = mergeJobs(result.prevJobs || [], incomingJobs);
        console.log('merge', merge);
        var notification_count = merge.filter((a) => {
          return a.notification_triggered == false;
        }).length;

        console.log('notification_count', notification_count);
        if (notification_count > 0) {
          // console.log('notification loop');
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon-34.png',
            title: 'This is a notification',
            message: `${notification_count}`,
          });
          setTimeout(() => {
            chrome.storage.local.set({
              prevJobs: merge.map((a) => {
                a.notification_triggered = true;
                return a;
              }),
            });
            // .then(() => {
            //   setTimeout(() => {
            //     chrome.storage.local.get('prevJobs', (result) => {
            //       console.log(
            //         'prevjobs after value set true',
            //         result.prevJobs
            //       );
            //     });
            //   }, 500);
            // });
          }, 500);
        }
      });
    }
  });
});

const mergeJobs = (prevJobs, newJobs) => {
  if (prevJobs === null) {
    return newJobs;
  } else {
    var totalJobs = newJobs.filter(
      (njob) => !prevJobs.find((pjob) => njob.uid === pjob.uid)
    );
    return [...totalJobs, ...prevJobs];
  }
};
