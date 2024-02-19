#!/bin/bash
if [ "$HUGO_ENVIRONMENT" == "production" ]; then
    npm run build;    
else    
    npm install pagefind;
    npx pagefind --site public/docs --output-path static/pagefind
    npm run build -- -b $CF_PAGES_URL;
fi;
