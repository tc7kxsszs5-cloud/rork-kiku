#!/usr/bin/env node

const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN 
});

async function fetchSponsors() {
  try {
    const { data } = await octokit.rest.users.listSponsorsForUser({
      username: 'tc7kxsszs5-cloud'
    });
    
    if (data && data.length > 0) {
      console.log('Sponsors found:', data.length);
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log('No sponsors found yet.');
    }
  } catch (error) {
    console.error('Error fetching sponsors:', error.message);
    process.exit(1);
  }
}

fetchSponsors();
