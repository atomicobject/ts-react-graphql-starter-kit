web: node --optimize_for_size --gc_interval=100 --max_old_space_size=${NODE_MAX_OLD_SIZE:-460} ./dist/server.js
worker: node --optimize_for_size --gc_interval=100 --max_old_space_size=${NODE_MAX_OLD_SIZE:-460} ./dist/scripts/job-worker.js
release: yarn heroku-release