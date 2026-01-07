#!/usr/bin/env node

/**
 * Script to fetch GitHub sponsors for the organization/user
 * This script is used by the sponsors.yml GitHub Actions workflow
 */

const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

async function fetchSponsors() {
  console.log('Starting sponsor fetch process...');
  
  // Validate environment variables
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('ERROR: GITHUB_TOKEN environment variable is not set');
    process.exit(1);
  }
  
  console.log('GITHUB_TOKEN is present');
  
  const username = process.env.GITHUB_REPOSITORY_OWNER || 'tc7kxsszs5-cloud';
  console.log(`Fetching sponsors for user: ${username}`);
  
  // Initialize Octokit with authentication
  const octokit = new Octokit({ 
    auth: token,
    log: {
      debug: (message) => console.log('[DEBUG]', message),
      info: (message) => console.log('[INFO]', message),
      warn: (message) => console.warn('[WARN]', message),
      error: (message) => console.error('[ERROR]', message),
    }
  });
  
  try {
    console.log('Attempting to fetch sponsors from GitHub API...');
    
    // Check if the API endpoint is available
    const { data: user } = await octokit.rest.users.getByUsername({
      username: username
    });
    
    console.log(`User found: ${user.login} (${user.name || 'No name'})`);
    console.log(`User type: ${user.type}`);
    
    // Try to fetch sponsors
    // Note: This API might not be available for all users/organizations
    // It requires GitHub Sponsors to be enabled and proper permissions
    try {
      const response = await octokit.rest.users.listSponsorsForUser({
        username: username
      });
      
      const sponsors = response.data || [];
      console.log(`Successfully fetched sponsors. Count: ${sponsors.length}`);
      
      if (sponsors.length > 0) {
        console.log('Sponsors:');
        sponsors.forEach((sponsor, index) => {
          console.log(`  ${index + 1}. ${sponsor.login || 'Unknown'} - ${sponsor.type || 'N/A'}`);
        });
      } else {
        console.log('No sponsors found or GitHub Sponsors is not enabled for this account');
      }
      
      // Save sponsors list to a file
      const sponsorsFile = path.join(__dirname, '..', 'SPONSORS.json');
      fs.writeFileSync(sponsorsFile, JSON.stringify(sponsors, null, 2));
      console.log(`Sponsors list saved to: ${sponsorsFile}`);
      
      return sponsors;
      
    } catch (apiError) {
      // Handle specific API errors
      if (apiError.status === 404) {
        console.warn('WARN: GitHub Sponsors API returned 404. This could mean:');
        console.warn('  1. GitHub Sponsors is not enabled for this account');
        console.warn('  2. The account does not have any sponsors');
        console.warn('  3. The GITHUB_TOKEN does not have required permissions');
        console.warn('Required token scopes: repo, read:org, user');
        return [];
      } else if (apiError.status === 403) {
        console.error('ERROR: API returned 403 Forbidden. Token may lack required permissions.');
        console.error('Required token scopes: repo, read:org, user');
        throw apiError;
      } else {
        throw apiError;
      }
    }
    
  } catch (error) {
    console.error('ERROR: Failed to fetch sponsors');
    console.error('Error details:');
    console.error(`  Message: ${error.message || 'Unknown error'}`);
    console.error(`  Status: ${error.status || 'N/A'}`);
    
    if (error.response) {
      console.error(`  Response status: ${error.response.status}`);
      console.error(`  Response data:`, JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.status === 401) {
      console.error('Authentication failed. Please check that GITHUB_TOKEN is valid.');
    }
    
    // Exit with error code for workflow to detect failure
    process.exit(1);
  }
}

// Run the function
fetchSponsors()
  .then(() => {
    console.log('Sponsor fetch process completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Unexpected error in sponsor fetch process:', error);
    process.exit(1);
  });
