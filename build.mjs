import {mkdirSync,cpSync,copyFileSync,readFileSync,writeFileSync} from 'node:fs';
mkdirSync('dist',{recursive:true});
let html=readFileSync('index.html','utf8');
const host=process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://'+process.env.VERCEL_PROJECT_PRODUCTION_URL : '');
const origin=host ? new URL(host).origin : '';
if(origin){
html=html.replace('</head>','<link rel="canonical" href="'+origin+'/"><meta property="og:url" content="'+origin+'/"></head>');
writeFileSync('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+origin+'/</loc></url></urlset>');
}
const preview=process.env.VERCEL_ENV==='preview';
if(preview) html=html.replace('content="index,follow"','content="noindex,nofollow"');
writeFileSync('dist/index.html',html);
writeFileSync('dist/robots.txt',preview?'User-agent: *\nDisallow: /\n':'User-agent: *\nAllow: /\n'+(origin?'Sitemap: '+origin+'/sitemap.xml\n':''));
copyFileSync('llms.txt','dist/llms.txt');

cpSync('assets','dist/assets',{recursive:true});
