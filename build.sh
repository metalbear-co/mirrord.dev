#!/bin/bash
npm run build;
npx pagefind --site public/docs --output-path static/pagefind
if [ "$HUGO_ENVIRONMENT" == "production" ]; then
    npm run build;
else
    npm run build -- -b $CF_PAGES_URL;
fi;