#!/usr/bin/env node

/**
 * Script to fetch GitHub sponsors for the organization/user
 * This script is used by the sponsors.yml GitHub Actions workflow
 * 
 * NOTE: The GitHub REST API's sponsor-related endpoints may be limited or require
 * the GraphQL API for full functionality. If the REST endpoint fails, consider
 * migrating to the GitHub GraphQL API to fetch sponsor information.
 * 
 * @requires @octokit/rest - GitHub REST API client
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
    // IMPORTANT: The GitHub REST API may not have a direct endpoint for sponsors
    // The endpoint 'users.listSponsorsForUser' may not exist in all versions of @octokit/rest
    // If this fails, you may need to use the GitHub GraphQL API instead
    // GraphQL query example: query { user(login: "username") { sponsors { nodes { login } } } }
    try {
      // Try to use the REST API endpoint if it exists
      // Note: This may fail if the endpoint is not available
      let response;
      if (typeof octokit.rest.users.listSponsorsForUser === 'function') {
        response = await octokit.rest.users.listSponsorsForUser({
          username: username
        });
      } else {
        // Fallback: endpoint doesn't exist, treat as no sponsors
        console.warn('WARN: listSponsorsForUser endpoint not available in REST API');
        console.warn('Consider using GitHub GraphQL API for sponsor data');
        throw { status: 404, message: 'API endpoint not available' };
      }
      
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
      
      // Save sponsors list to a file with error handling
      const sponsorsFile = path.join(__dirname, '..', 'SPONSORS.json');
      try {
        fs.writeFileSync(sponsorsFile, JSON.stringify(sponsors, null, 2));
        console.log(`Sponsors list saved to: ${sponsorsFile}`);
      } catch (writeError) {
        console.error('ERROR: Failed to write SPONSORS.json file');
        console.error(`  Write error: ${writeError.message}`);
        throw writeError;
      }
      
      return sponsors;
      
    } catch (apiError) {
      // Handle specific API errors
      if (apiError.status === 404) {
        console.warn('WARN: GitHub Sponsors API returned 404. This could mean:');
        console.warn('  1. GitHub Sponsors is not enabled for this account');
        console.warn('  2. The account does not have any sponsors');
        console.warn('  3. The GITHUB_TOKEN does not have required permissions');
        console.warn('  4. The API endpoint may require GraphQL instead of REST');
        console.warn('Required token scopes: repo, read:org, user');
        
        // Create an empty sponsors file to indicate no sponsors were found
        const sponsorsFile = path.join(__dirname, '..', 'SPONSORS.json');
        try {
          fs.writeFileSync(sponsorsFile, JSON.stringify([], null, 2));
          console.log('Created empty SPONSORS.json file');
        } catch (writeError) {
          console.warn('Could not write empty SPONSORS.json file:', writeError.message);
        }
        
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
