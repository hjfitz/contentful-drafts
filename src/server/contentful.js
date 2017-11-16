require('local-env-var')();

const contentful = require('contentful-management');
const express = require('express');

const managementApi = express.Router();

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT,
});

const sortEntries = (ev1, ev2) => {
  const ev1Start = new Date(ev1.sys.updatedAt);
  const ev2Start = new Date(ev2.sys.updatedAt);
  if (ev1Start < ev2Start) {
    return -1;
  } else if (ev1Start > ev2Start) {
    return 1;
  }
  return 0;
};

const getDrafts = async () => {
  // get a handle on the space
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE);
  // get all entries
  const entries = await space.getEntries({ limit: 1000 });
  const numEntries = entries.total;
  // find all drafts
  const rawDrafts = entries.items.filter(entry => entry.isDraft() || entry.isUpdated());

  const numDrafts = rawDrafts.length;

  const drafts = rawDrafts.sort(sortEntries).map(draft => {
    const { fields, sys } = draft;
    const rawTitle = fields.fullName || fields.fullTitle || fields.contentfulName || fields.name || fields.title || fields.slug || 'Title Not Found';
    const title = rawTitle instanceof Object && 'en-US' in rawTitle ? rawTitle['en-US'] : rawTitle;
    return {
      title,
      contentType: sys.contentType.sys.id,
      updated: sys.updatedAt,
      created: sys.createdAt,
      updatedBy: sys.updatedBy,
      contentfulLink: `https://app.contentful.com/spaces/${process.env.CONTENTFUL_SPACE}/entries/${sys.id}`,
    }
  });

  return { drafts, numEntries, numDrafts };
}

managementApi.get('/drafts', async (req, res) => {
  const drafts = await getDrafts();
  res.json(drafts);
});


module.exports = managementApi;