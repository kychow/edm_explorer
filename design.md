# [1-pager] EDM Artists.like 
## Find EDM artists you like 

## Market Research
Does something like this exist already? 

### Every noise at once
https://everynoise.com/  
Every noise is the most comprehensive, but it’s not interactive and it’s not mobile-friendly. I don’t really get a clear sense of the existing EDM music scene with just one glance the way I do with colourtext’s music genre map - https://colourtext.com/workspace/files/colourtext-music-genre-map.pdf 
￼
### Music Gateway
https://www.musicgateway.com/music-genres-map    
This is more promising, but genres are clustered at the top-level only. Where is House EDM on this chart? 
￼
### Music Map
https://www.music-map.com/audien
I like this graph, but it’s very bare-bones — there is no data and no width shown on the links between two artists. If the authors don’t store any data in the links between artists, a better UI would be a table showing top similar artists ordered by distance to the artist queried. Otherwise, there’s a lot of whitespace and the site isn’t information-dense. While the artists detected didn’t feel very similar to the artist I requested (Audien), Music Map overall is still the closest to the tool I’d like to build. 
￼
### Honorable mention: Spotify Artist Discovery section + Spotify radio for specific songs. 
Spotify has an h-scroll section 

## Goal
Build a mobile page to help users identify what type of EDM they like, and why designed to go viral on TikTok. 

## Summary
What do we need to make this go viral? Users need to be able to input their listening data
Users need to be able to easily navigate to the page from the TikTok App
- [ ] Understand what type of EDM I like 
- [ ] Connect on IG with people who also like this genre of music (social context / connectivity) - or on same platform?  

## Features 
1. Spotify API integration 
2. Store Backend user data
3. Compute 
4. Synthesize 
5. Graph vis 
6. Teach users how to build 
7. Share with friends (generate pic to share with friends or link) 

## Tech Stack
- [ ] Backend design (QPS to sustain vitality … = ?)  
- [ ] Graph vis - pygraphistry OR WebGL  

## User Needs
TBD 

## Constraints
Max QPS 
Spotify API request limit: we might want to limit 
DigitalOcean Read rate 

## Data Model
Network Diagram https://codesandbox.io/s/cosmos-example-fmuf1x?file=/src/index.ts

Undirected and weighted: # of times 2 EDM artists have collaborated with each other
Node {
    id: string;
    name: string;
    group: number; // a group number can be assigned to each artist to cluster them
}

Link {
    source: string; // the ID of the source artist node
    target: string; // the ID of the target artist node
    similarity: number; // the similarity value between the two artists
}

## Tech Stack (Bare Bones, No User Input) 
Feature 	Tech Stack 	Why
Data Source	Spotify web API 	Has existing endpoint; I use it myself. 
Database	PostgresQL	Postgres offers good performance for simple queries. There will be more requests to load the graph than to tap around. 
Data Host	Digital Ocean Droplet (virtual private server)  	$133 credit expires March 26
Network Graph	D3.js library	

##  Milestones 
- [x] Define API Request Schema  
- [x] Send successful Spotify CURL request with right params 
- [x] Set up github with Spotify authentication 
- [] Store data for my top 50 EDM artists in digital ocean DB 
- [] Create 

Steps to repro
npm install spotify-web-api-node 

## OpenAI Preprompt: 
write a js file on a digitalocean droplet that uses spotify-web-api-node to query the spotify web API and calculate the similarity between 50 EDM artists and stores the similarity between artists in a postgresQL database to be visualized using D3.js as a undirected network on iOS safari. What sort of data would be relevant to query the spotify web API and what would such a data model look like? 

## Success
Users are able to share it like the EDM 3-day concert festival lineup 

## References 
https://music.ishkur.com/ 
https://everynoise.com/engenremap.html 
http://davidpiegza.github.io/Graph-Visualization/index.html  