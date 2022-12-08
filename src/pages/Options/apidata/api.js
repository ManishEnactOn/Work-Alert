import axios from 'axios';
import XMLParser from 'fast-xml-parser';
const parser = new XMLParser.XMLParser();

export const getAllJobs = async (keywords = []) => {
  //  await keepAuthenticated();
  let filtered = [];

  for (let i = 0; i < keywords.length; i++) {
    const url = keywords[i].rss;
    await axios
      .get(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
      .then((response) => {
        const original = response.data;
        let xmlJobList = parser.parse(original);

        xmlJobList.rss.channel.item.map((item) => {
          filtered.push({
            title: item.title.replace(' - Upwork', ''),
            link: item.link,
            // date: new Date(
            //   (item.description.match(/<b>Posted On<\/b>: ([^<]+)/) || [
            //     null,
            //     new Date().toUTCString(),
            //   ])[1]
            // ).toJSON(),
            // budget: (item.description.match(/<b>Budget<\/b>: ([^<]+)/) || [
            //   null,
            //   null,
            // ])[1],
            // hourly: (item.description.match(
            //   /<b>Hourly Range<\/b>: ([^<]+)/
            // ) || [null, null])[1],
            description: item.description
              .replace(/< b>Posted On<\/b>: [^<]+<br \/>/, '')
              .replace(/<b>Budget<\/b>: [^<]+<br \/>/, '')
              .replace(/<b>Hourly Range<\/b>: [^<]+<br \/>/, '')
              .replace(/<b>Hourly Range<\/b>: [^<]+<br \/>/, '')
              .replace(/<b>Skills<\/b>:([^<]+)/, '')
              .replace(/<b>Country<\/b>:([^<]+)/, '')
              .replace(/<b>Category<\/b>:([^<]+)/, '')
              .replace(/<b>posted on<\/b>:([^<]+)/i, '')
              .replace(/<a href="([^]+)/, '')
              .replace(/(<br \/>)+/g, '')
              .replace(/(&nbsp;)+/g, ''),
            uid: item.guid,
            keyword: keywords[i].keyword,
            __seen: false,
            notification_triggered: false,
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return filtered;
};

export const getAllJobsData = async (keywords) => {
  let filtered = [];

  for (let i = 0; i < keywords.length; i++) {
    const url = keywords[i].rsslink;
    await fetch(url, {
      method: 'GET',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
      .then((response) => response.text())
      .then((response) => {
        const original = response;
        let xmlJobList = parser.parse(original);

        xmlJobList.rss.channel.item.map((item) => {
          filtered.push({
            title: item.title.replace(' - Upwork', ''),
            link: item.link,
            date: new Date(
              (item.description.match(/<b>Posted On<\/b>: ([^<]+)/) || [
                null,
                new Date().toUTCString(),
              ])[1]
            ).toJSON(),
            budget: (item.description.match(/<b>Budget<\/b>: ([^<]+)/) || [
              null,
              null,
            ])[1],
            hourly: (item.description.match(
              /<b>Hourly Range<\/b>: ([^<]+)/
            ) || [null, null])[1],
            description: item.description
              .replace(/< b>Posted On<\/b>: [^<]+<br \/>/, '')
              .replace(/<b>Budget<\/b>: [^<]+<br \/>/, '')
              .replace(/<b>Hourly Range<\/b>: [^<]+<br \/>/, '')
              .replace(/<b>Hourly Range<\/b>: [^<]+<br \/>/, '')
              .replace(/<b>Skills<\/b>:([^<]+)/, '')
              .replace(/<b>Country<\/b>:([^<]+)/, '')
              .replace(/<b>Category<\/b>:([^<]+)/, '')
              .replace(/<b>posted on<\/b>:([^<]+)/i, '')
              .replace(/<a href="([^]+)/, '')
              .replace(/(<br \/>)+/g, '')
              .replace(/(&nbsp;)+/g, ''),
            uid: item.guid,
            keyword: keywords[i].text,
            __seen: false,
            notification_triggered: false,
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return filtered;
};

export const mergeJobs = ({ oldJobs, incomingJobs }) => {
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
    return newJobs;
  }
  return incomingJobs;
};

export const fetchPreviousJobs = async () => {
  console.log('calling  fetch Jobs');
  // const keywords = localStorageService.getItem('list');
  const answer = await chrome.storage.local.get();
  const keywords = answer.list;
  console.log('keywords', keywords);
  if (keywords && keywords.length !== 0) {
    const result = await getAllJobs(keywords);
    if (result && result.length !== 0) {
      const incomingJobs = result;
      const storage = await chrome.storage.local.get();
      const oldJobs = storage.prevJobs ? storage.prevJobs : [];
      const merge = mergeJobs({
        oldJobs,
        incomingJobs,
      });
      // const slicedJobs = sliceJobs(merge);
      console.log('merge', merge);
      chrome.storage.local.set({ prevJobs: merge });
      return merge;
    } else {
      return [];
    }
  }
  return [];
};
